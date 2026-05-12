from flask import Blueprint, request, jsonify
from supabase import create_client
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from config.config import (
    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
    AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_CONTAINER
)
from datetime import datetime, timedelta
import uuid

posts_bp = Blueprint("posts", __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
blob_service = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)


def get_sas_url(blob_name):
    account_name = blob_service.account_name
    account_key = blob_service.credential.account_key
    sas_token = generate_blob_sas(
        account_name=account_name,
        container_name=AZURE_STORAGE_CONTAINER,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(hours=1)
    )
    return f"https://{account_name}.blob.core.windows.net/{AZURE_STORAGE_CONTAINER}/{blob_name}?{sas_token}"


@posts_bp.route("/", methods=["GET"])
def get_posts():
    try:
        response = supabase.table("posts").select(
            "*, profiles(username, avatar_url)"
        ).order("created_at", desc=True).execute()

        posts = response.data
        for post in posts:
            if post.get("image_url"):
                post["image_url"] = get_sas_url(post["image_url"])

        return jsonify(posts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@posts_bp.route("/", methods=["POST"])
def create_post():
    try:
        image = request.files.get("image")
        caption = request.form.get("caption", "")
        user_id = request.form.get("user_id")

        if not image or not user_id:
            return jsonify({"error": "Image and user_id are required"}), 400

        # Upload image to Azure Blob Storage
        blob_name = f"{uuid.uuid4()}_{image.filename}"
        blob_client = blob_service.get_blob_client(
            container=AZURE_STORAGE_CONTAINER,
            blob=blob_name
        )
        blob_client.upload_blob(image.read(), overwrite=True)

        # Save post metadata to Supabase
        response = supabase.table("posts").insert({
            "user_id": user_id,
            "caption": caption,
            "image_url": blob_name
        }).execute()

        return jsonify({"message": "Post created", "post": response.data[0]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@posts_bp.route("/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    try:
        # Get post to find blob name
        post = supabase.table("posts").select("*").eq("id", post_id).single().execute()
        blob_name = post.data["image_url"]

        # Delete from Azure Blob Storage
        blob_client = blob_service.get_blob_client(
            container=AZURE_STORAGE_CONTAINER,
            blob=blob_name
        )
        blob_client.delete_blob()

        # Delete from Supabase
        supabase.table("posts").delete().eq("id", post_id).execute()

        return jsonify({"message": "Post deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400