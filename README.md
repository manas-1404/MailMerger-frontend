# MailMerger Frontend

MailMerger Frontend is a React + TypeScript web application built with Vite, designed as the user interface for the MailMerger system. It allows users to automate, compose, and manage email campaigns, templates, and resume uploads, integrating tightly with a backend API.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Frontend](#running-the-frontend)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Backend Repository](#backend-repository)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [ESLint & Code Quality](#eslint--code-quality)
- [Contributing](#contributing)

---

## Features

- **User Authentication:** Supports both email/password and Google OAuth2 login and signup.
- **Email Dashboard:** Central dashboard to access core features and manage user sessions.
- **Email Writing & Queueing:** Compose emails, queue them for sending, and manage the queue.
- **Email Templates:** Create, manage, and delete reusable email templates.
- **Resume Upload:** Upload PDF resumes (max 5MB) to the backend for processing.
- **Token Management:** Automatic JWT and refresh token handling to keep sessions valid.

## Prerequisites

- **Node.js** (>= 16.x)
- **npm** (>= 8.x) or **yarn**
- Access to a running MailMerger backend server with REST API endpoints.
- The backend URL is configured via environment variables.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manas-1404/MailMerger-frontend.git
   cd MailMerger-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

Create a `.env` file in the root of the project and set the backend server URL:

```
VITE_BACKEND_URL=https://your-backend-server.com
```

This variable is required for API calls. All authentication and data requests in the frontend will use this base URL.

## Running the Frontend

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (default Vite port).

## Connecting to the Backend

- Ensure the backend server is running and accessible at the URL specified in your `.env` file.
- The backend must expose the following endpoints (examples):
    - `/api/auth/login` and `/api/auth/signup` for user authentication
    - `/api/oauth/gmail-authorize` for Google OAuth2
    - `/api/storage/upload-file` for resume uploads
    - `/api/templates/get-all-templates` for email templates
    - `/api/auth/refresh-jwt-token` and `/api/auth/renew-refresh-and-jwt-token` for token management

See the [src/api/](src/api/) directory for details on API integration.

### Backend Repository

The backend code for this project is available at:  **[@manas-1404/MailMerger-backend](https://github.com/manas-1404/MailMerger-backend)**  
Please refer to the backend repository for API documentation, setup instructions, and all server-side logic.

## Usage Guide

1. **Sign Up / Log In:**
    - Standard login requires email and password.
    - Alternatively, click "Sign in with Google" for OAuth2 authentication.

2. **Dashboard Navigation:**
    - After login, access the dashboard with options to:
        - Write and queue emails
        - Create/manage templates
        - Upload resumes (PDF only, max 5MB)
        - Send emails from the queue

3. **Uploading a Resume:**
    - Navigate to "Upload Resume" in the navigation bar.
    - Select a PDF file and submit. Only PDF format is accepted; max size is enforced.

4. **Email Queue and Templates:**
    - Create templates for reuse.
    - Manage your email queue before sending.
    - Templates are fetched and managed via secured backend endpoints.

5. **Token Handling:**
    - JWT and refresh tokens are stored in localStorage.
    - Tokens are automatically refreshed via backend endpoints (`/api/auth/refresh-jwt-token`).

## Project Structure

- `src/`
    - `api/` – All backend API integrations
    - `components/` – Reusable UI components (NavBar, UploadFileCard, etc.)
    - `routes/` – Page-level React components (Dashboard, Login, Signup, etc.)
    - `types/` – TypeScript type definitions
    - `main.tsx` – App entry point and router setup
- `.env` – Environment configuration for backend URL

## ESLint & Code Quality

- Codebase uses TypeScript and ESLint with recommended and type-checked rules.
- See `eslint.config.js` for configuration.
- Additional plugins for React and DOM can be added for stricter linting.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. Ensure code is formatted and passes linting.

---

**Backend Setup**

The backend server must be running and configured for JWT/OAuth authentication. For setup instructions, refer to the backend repository and ensure the required endpoints are exposed and CORS is configured to allow requests from your frontend domain.

---

**Contact**

For questions or support, please open an issue on GitHub or reach out to the repository owner.
