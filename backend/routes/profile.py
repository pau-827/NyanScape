from flask import Blueprint, request, jsonify
from supabase import create_client
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from config.config import (
    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
    AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_CONTAINER
)
from datetime import datetime, timedelta
import uuid

profile_bp = Blueprint("profile", __name__)
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
        expiry=datetime.utcnow() + timedelta(hours=24)
    )
    return f"https://{account_name}.blob.core.windows.net/{AZURE_STORAGE_CONTAINER}/{blob_name}?{sas_token}"


@profile_bp.route("/upload-avatar", methods=["POST"])
def upload_avatar():
    try:
        image = request.files.get("image")
        user_id = request.form.get("user_id")

        if not image or not user_id:
            return jsonify({"error": "Image and user_id are required"}), 400

        # Upload to Azure Blob Storage
        blob_name = f"avatars/{user_id}_{uuid.uuid4()}_{image.filename}"
        blob_client = blob_service.get_blob_client(
            container=AZURE_STORAGE_CONTAINER,
            blob=blob_name
        )
        blob_client.upload_blob(image.read(), overwrite=True)

        # Generate SAS URL
        avatar_url = get_sas_url(blob_name)

        # Save blob_name to Supabase profiles table
        supabase.table("profiles").update({
            "avatar_url": blob_name
        }).eq("id", user_id).execute()

        return jsonify({"message": "Avatar uploaded", "avatar_url": avatar_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@profile_bp.route("/update", methods=["POST"])
def update_profile():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        username = data.get("username")
        bio = data.get("bio")

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        update_data = {}
        if username: update_data["username"] = username
        if bio is not None: update_data["bio"] = bio

        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        return jsonify({"message": "Profile updated", "profile": response.data[0]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@profile_bp.route("/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        profile = response.data

        # Generate SAS URL for avatar if exists
        if profile.get("avatar_url"):
            profile["avatar_url"] = get_sas_url(profile["avatar_url"])

        return jsonify(profile), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
