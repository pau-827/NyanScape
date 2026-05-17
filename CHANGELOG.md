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
- `[Sanglay]` - Listed feature and pages to apply in the project
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

- `[Sanglay]` - Adjusted Azure Architecture Diagram by adding Supabase SQL
- `[Muit]` - Redesigned Login and Register pages with split-screen wavy SVG layout
- `[Muit]` - Updated global theme to purple color scheme
- `[Panliboton]` - Finalized Azure Architecture Diagram

### Removed

- `[Muit]` - Removed card box constraint, auth layout now full-screen

### Changed

- `[Panliboton]` - Updated and finalized the Azure cloud architecture diagram

### Added

- `[Panliboton]` - Created and configured the Flask backend structure
- `[Panliboton]` - Added Supabase authentication routes for signup and login

## [2026-05-14]

### Added

- `[Sanglay]` - Created system design plan and reference
- `[Panliboton]` - Created logo for the system
- `[Panliboton]` - Created pages needed for the system

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
- `[Sanglay]` - Tested and documented existing errors in the new pages

### Changed

- `[Panliboton]` - Merged css files of pages

## [2026-05-16]

### Added

- `[Muit]` - Add Azure startup config

### Fixed

- `[Muit]` - Used Supabase client directly to fix auth pages' route
- `[Muit]` - Connected Home and Createpost to backend
- `[Muit]` - Connected Profile, Explore, Settings to real Supabase and backend data
- `[Panliboton]` - Fix some minor features in every pages 

### Added

- `[Muit]` - Prepared backend for Azure deployment

### Fixed

- `[Muit]` - Updated GitHub Actions workflow to use backend/ directory

### Removed

- `[Muit]` - Removed duplicate Azure workflow file
- `[Sanglay]` - Removed Bookmark page UI that has no function

### Fixed

- `[Muit]` - Fixed the header and footer in auth pages that disappeared
- `[Muit]` - Tried adjusting side navigation bar to unify size across all pages

### Added

- `[Muit]` - Added Comment button and function and connected it and like to backend
- `[Sanglay]` - Calculate cost estimate report with Microsoft Azure Pricing Calculator and fetched the monthly cost
 
 ### Removed

- `[Muit]` - Extracted and removed the side navigation bar from all pages and modified a one for all

### Added

- `[Sanglay]` - Documented and listed the system's conclusion and recommendations so far
- `[Sanglay]` - Listed down all the features applied and to be implemented
- `[Muit]` - Created README markdown file for the whole project
- `[Muit]` - Added more deployment process screenshots
- `[Sanglay]` - Created deployment instructions in README
- `[Muit]` - Added deployment instructions in README
- `[Sanglay]` - Initial Report Documentation of Cost Estimate

### Changed

- `[Panliboton]` - Updated Cost Estimate report
- `[Muit]` - Finalized Cost Estimate report

## [2026-05-17]

### Added

- `[Muit]` - Added profile picture upload to Azure

### Fixed

- `[Muit]` - Fixed profile bio saving issues to Supabase
- `[Muit]` - Reflected user profile photo in FYP

### Changed

- `[Muit]` - Updated temporary logo to the official logo in navbar and auth pages