## Notification Platform (Production-Ready, Async, AI-Powered)

Full-stack Notification System with Admin Dashboard.

### Tech stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Redis, BullMQ
- **Workers**: BullMQ worker processes
- **Providers**: SendGrid (Email), Twilio (SMS), Firebase Cloud Messaging (Push), In-app (DB + API)
- **AI**: OpenAI API (message generation, best-send-time, spam detection, engagement prediction)
- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Auth**: JWT (Admin)

### Architecture (high-level)

Client/Service → API (`backend`) → MongoDB (store) → BullMQ/Redis (queue) → Worker (`backend` worker) → Provider APIs → Logs/Status in MongoDB

### Quickstart (Docker)

1. Copy env files:

```bash
cd notification-platform
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

2. Start everything:

```bash
docker compose up --build
```

- API: `http://localhost:4000`
- Admin UI: `http://localhost:3000`

### Seed an admin user

The backend auto-seeds an admin on startup when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set.

### Documentation

- **Backend docs**: `backend/README.md`
- **API reference**: `backend/docs/api.md`
- **Architecture diagram**: `backend/docs/architecture.mmd`

