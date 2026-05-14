# Changelog

All notable changes to this project will be documented in this file.

## [2025-05-11]

- `[Muit]` - Created GitHub repository and pushed initial activities (project tree & vite setup)

## [2025-05-13]

- `[Muit]` - Initialized Flask backend with virtual environment (Python 3.11)
- `[Muit]` - Installed dependencies: flask, flask-cors, supabase, azure-storage-blob, python-dotenv, gunicorn
- `[Muit]` - Created requirements.txt with pinned dependency versions
- `[Muit]` - Created .env template for local environment configuration

- `[Muit]` - Created Flask app entry point (app.py) with CORS and blueprint registration
- `[Muit]` - Added auth routes: signup, login, logout via Supabase Auth
- `[Muit]` - Added posts routes: get all posts, create post with Azure Blob upload, delete post
- `[Muit]` - Added likes routes: like, unlike, get like count per post
- `[Muit]` - Added comments routes: get, add, delete comments per post
- `[Muit]` - Configured Azure Blob Storage SAS token generation for secure image serving

- `[Panliboton]` - Created Azure Architecture Diagram

- `[Muit]` - Built React frontend with Login, Register, Home, Profile pages
- `[Muit]` - Added PostCard component with likes and comments
- `[Muit]` - Added UploadForm component with image preview
- `[Muit]` - Connected frontend to Flask API via axios
- `[Muit]` - Added Supabase auth session management in App.jsx

- `[Muit]` - Redesigned Login and Register pages with split-screen wavy SVG layout
- `[Muit]` - Updated global theme to purple color scheme (#7c3aed)
- `[Muit]` - Removed card box constraint, auth layout now full-screen

- `[Ayelyn]` - Updated and finalized the Azure cloud architecture diagram
- `[Ayelyn]` - Created and configured the Flask backend structure
- `[Ayelyn]` - Added Supabase authentication routes for signup and login

