**Chat — Realtime Messaging App**

A lightweight realtime chat application with a React + Vite frontend and a Node/Express backend. Features user auth, messaging, Cloudinary image uploads, and WebSockets for live updates.

**Quick Start**
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
