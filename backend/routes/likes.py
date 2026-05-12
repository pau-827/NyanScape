from flask import Blueprint, request, jsonify
from supabase import create_client
from config.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

likes_bp = Blueprint("likes", __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


@likes_bp.route("/", methods=["POST"])
def like_post():
    data = request.get_json()
    user_id = data.get("user_id")
    post_id = data.get("post_id")

    try:
        response = supabase.table("likes").insert({
            "user_id": user_id,
            "post_id": post_id
        }).execute()
        return jsonify({"message": "Post liked"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@likes_bp.route("/", methods=["DELETE"])
def unlike_post():
    data = request.get_json()
    user_id = data.get("user_id")
    post_id = data.get("post_id")

    try:
        supabase.table("likes").delete().eq("user_id", user_id).eq("post_id", post_id).execute()
        return jsonify({"message": "Post unliked"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@likes_bp.route("/<post_id>", methods=["GET"])
def get_likes(post_id):
    try:
        response = supabase.table("likes").select("*").eq("post_id", post_id).execute()
        return jsonify({"likes": len(response.data)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400