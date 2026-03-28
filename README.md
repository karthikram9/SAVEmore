# SAVEmore - Personal Finance Manager

A full-stack Personal Finance Manager built with modern web technologies: React, Vite, TailwindCSS, Express, MongoDB, and Recharts.

## 🚀 Deployment & Production Setup

### 1. MongoDB (Atlas) Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and whitelist your IPs. For testing/global access, you can add `0.0.0.0/0` (allow all).
3. Under **Database Access**, create a user and securely save the login credentials.
4. Go to **Clusters** > **Connect** > **Connect your application** to get your connection string.
5. Replace `<password>` within it with your database password. This resulting string represents your `MONGO_URI`.

### 2. Backend Server Deployment (Render)
This backend is fully prepared for auto-deployment via Render using the configured `render.yaml`.

**Environment Variables Required:**
- `MONGO_URI` = from MongoDB Atlas
- `JWT_SECRET` = securely randomly-generated secret block
- `CLIENT_URL` = your frontend domain from Vercel (e.g., https://savemore.vercel.app) configuring CORS securely
- `PORT` = `5000`

**Render Setup:**
1. Push your repository to GitHub.
2. In Render, create a new "Blueprint Instance" and connect your repository. Render will automatically detect the blueprint inside `render.yaml`.
3. Add any missing environment secrets (`MONGO_URI`, `CLIENT_URL`) inside the Render dashboard configuration settings.

### 3. Frontend Deployment (Vercel)
This frontend natively supports SPA routing via `vercel.json` rewrites and dynamically adjusts paths to align with the backend server routing correctly.

**Environment Variable Required:**
- `VITE_API_URL` = URL of your newly deployed Render backend (e.g., `https://savemore-api.onrender.com`)

**Vercel Setup:**
1. Connect your GitHub repository directly to Vercel via their Import dashboard.
2. In the deployment settings configuration block, add the environment variable `VITE_API_URL` aligning it to your Render backend link smoothly.
3. Deploy!

---

## 💻 Local Development Environment

**1. Setup Backend (`/server/.env`):**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/savemore
JWT_SECRET=super_secret_jwt_key
```

**2. Setup Frontend (`/client/.env` textfile):**
```
VITE_API_URL=http://localhost:5000
```

**3. Test Stack Architecture:**
```bash
# Terminal 1: Background DB Server
cd server
npm install
npm run dev

# Terminal 2: Foreground Client
cd client
npm install
npm run dev
```

The app natively resolves at `http://localhost:3000`.
