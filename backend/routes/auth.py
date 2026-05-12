from flask import Blueprint, request, jsonify
from supabase import create_client
from config.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

auth_bp = Blueprint("auth", __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"username": username}}
        })
        return jsonify({"message": "Signup successful", "user": response.user.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return jsonify({
            "message": "Login successful",
            "access_token": response.session.access_token,
            "user": response.user.id
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        supabase.auth.sign_out()
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400