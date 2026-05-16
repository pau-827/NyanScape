# Changelog

All notable changes to this project will be documented in this file.

## [2026-05-11]

### Added

- `[Muit]` - Created GitHub repository and pushed initial activities (project tree & vite setup)

## [2026-05-13]

### Added

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

### Changed

- `[Muit]` - Redesigned Login and Register pages with split-screen wavy SVG layout
- `[Muit]` - Updated global theme to purple color scheme (#7c3aed)

### Removed

- `[Muit]` - Removed card box constraint, auth layout now full-screen

### Changed

- `[Panliboton]` - Updated and finalized the Azure cloud architecture diagram

### Added

- `[Panliboton]` - Created and configured the Flask backend structure
- `[Panliboton]` - Added Supabase authentication routes for signup and login

## [2026-05-14]

### Added

- `[Panliboton]` - Created logo for the system
- `[Panliboton]` - Creatied pages needed for the system

### Fixed

- `[Panliboton]` - Fixing the UI of the Home page

### Added

- `[Panliboton]` - Build the Explore Page and Fix the UI
- `[Panliboton]` - Created the CreatePost page and fix the UI on it

## [2026-05-15]

### Added

- `[Panliboton]` - Created the Bookmark page UI
- `[Panliboton]` - Created the Notification page UI
- `[Panliboton]` - Created the Message page UI 
- `[Panliboton]` - Created the Settings page UI

### Changed

- `[Panliboton]` - Merged css files of pages

## [2026-05-16]

### Added

- `[Muit]` - Add Azure startup config

### Fixed

- `[Muit]` - Used Supabase client directly to fixe auth pages' route
- `[Muit]` - Connected Home and Createpost to backend
- `[Muit]` - Connected Profile, Explore, Settings to real Supabase and backend data

### Added

- `[Muit]` - Prepared backend for Azure deployment

### Fixed

- `[Muit]` - Updated GitHub Actions workflow to use backend/ directory
