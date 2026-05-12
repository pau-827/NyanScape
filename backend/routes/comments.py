from flask import Blueprint, request, jsonify
from supabase import create_client
from config.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

comments_bp = Blueprint("comments", __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


@comments_bp.route("/<post_id>", methods=["GET"])
def get_comments(post_id):
    try:
        response = supabase.table("comments").select(
            "*, profiles(username, avatar_url)"
        ).eq("post_id", post_id).order("created_at").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@comments_bp.route("/", methods=["POST"])
def add_comment():
    data = request.get_json()
    try:
        response = supabase.table("comments").insert({
            "user_id": data.get("user_id"),
            "post_id": data.get("post_id"),
            "content": data.get("content")
        }).execute()
        return jsonify({"message": "Comment added", "comment": response.data[0]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@comments_bp.route("/<comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    try:
        supabase.table("comments").delete().eq("id", comment_id).execute()
        return jsonify({"message": "Comment deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400