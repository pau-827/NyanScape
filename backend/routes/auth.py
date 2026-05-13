from flask import Blueprint, request, jsonify
from supabase import create_client
from config.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

auth_bp = Blueprint("auth", __name__)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    print("SIGNUP DATA:", data)

    if not data:
        return jsonify({"error": "No data received"}), 400

    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    if not email or not password or not username:
        return jsonify({
            "error": "Email, password, and username are required"
        }), 400

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "username": username
                }
            }
        })

        if not response.user:
            return jsonify({"error": "Signup failed"}), 400

        return jsonify({
            "message": "Signup successful",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "username": username
            }
        }), 201

    except Exception as e:
        print("SIGNUP ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    print("LOGIN DATA:", data)

    if not data:
        return jsonify({"error": "No data received"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not response.session:
            return jsonify({"error": "Login failed"}), 401

        return jsonify({
            "message": "Login successful",
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return jsonify({"error": str(e)}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        supabase.auth.sign_out()

        return jsonify({
            "message": "Logged out successfully"
        }), 200

    except Exception as e:
        print("LOGOUT ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/test", methods=["GET"])
def test_auth():
    return jsonify({
        "message": "Auth route is working"
    }), 200