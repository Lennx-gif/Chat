**Chat — Realtime Messaging App**

A lightweight realtime chat application with a React + Vite frontend and a Node/Express backend. Features user auth, messaging, Cloudinary image uploads, and WebSockets for live updates.

## Branching Strategy

This project uses **separate deployment branches** for backend and frontend services:

- **`main`** — Unified reference branch with both services (backend/ and frontend/ directories). Use for architecture overview and syncing across services.
- **`backend`** — Backend service only, with code at repository root. Deploy from this branch for backend-only changes and independent backend release cycles.
- **`frontend`** — Frontend service only, with code at repository root. Deploy from this branch for frontend-only changes and independent frontend release cycles.

### Development Workflow

1. **For backend changes:** Create a feature branch from `backend`, make changes, then merge back to `backend`. Optionally sync to `main`.
   ```bash
   git checkout backend
   git checkout -b feature/my-backend-feature
   # ... make changes ...
   git commit -m "description"
   git push origin feature/my-backend-feature
   # Create PR to backend
   ```

2. **For frontend changes:** Create a feature branch from `frontend`, make changes, then merge back to `frontend`. Optionally sync to `main`.
   ```bash
   git checkout frontend
   git checkout -b feature/my-frontend-feature
   # ... make changes ...
   git commit -m "description"
   git push origin feature/my-frontend-feature
   # Create PR to frontend
   ```

3. **To sync services to `main`:** Merge either `backend` or `frontend` into `main` when ready for a unified release.

---

## Quick Start (on any branch)

### On `main` branch (with both services):
- **Install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

- **Environment:** create a `.env` file in `backend/` with these keys (example):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- **Run (development):**

```bash
# Start backend (from repository root or backend folder)
cd backend && npm run dev

# Start frontend (from repository root or frontend folder)
cd frontend && npm run dev
```

### On `backend` branch (backend only at root):
```bash
npm install
npm run dev
```

### On `frontend` branch (frontend only at root):
```bash
npm install
npm run dev
```

**Project Structure (high level)**
- **Backend:** controllers, models, middleware, and lib helpers for DB, Cloudinary, and WebSocket handling.
- **Frontend:** React + Vite app with pages (Home, Login, SignUp, Profile, Settings), components for chat UI, and state stores.

See main server entry: [backend/src/index.js](backend/src/index.js) and frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx).

**API Endpoints (examples)**
- `POST /api/auth/login` — login user
- `POST /api/auth/signup` — create account
- `GET /api/messages` — fetch messages
- `POST /api/messages` — send message

Routes are in `backend/src/routes` and controllers in `backend/src/controllers`.

**Environment & Deployment Notes**
- Use secure values for `JWT_SECRET` and your database credentials.
- Configure Cloudinary credentials to enable image uploads.
- For production, build the frontend (`npm run build`) and serve the static build from your preferred hosting or via the backend static middleware.

**Development Tips**
- Use a tool like `nodemon` for backend hot reload if available (`npm run dev`).
- Ensure the backend port and frontend dev proxy are configured correctly if the frontend proxies API requests.

**Contributing**
- Open issues or PRs for features and fixes. Keep changes small and focused.

**License**
- This project is available under the terms provided by the repository owner.

**Contact**
- For questions or help, open an issue in this repository.
