from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.posts import posts_bp
from routes.likes import likes_bp
from routes.comments import comments_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(posts_bp, url_prefix="/api/posts")
app.register_blueprint(likes_bp, url_prefix="/api/likes")
app.register_blueprint(comments_bp, url_prefix="/api/comments")

@app.route("/")
def index():
    return {"message": "NyanScape API is running!"}

if __name__ == "__main__":
    app.run(debug=True)