## Backend (Notification Platform)

### What this service does

- Accepts notification creation requests (`POST /notifications`)
- Enforces **rate limits**, **idempotency**, and **user preferences**
- Stores notifications/templates/preferences/logs in **MongoDB**
- Enqueues delivery jobs into **BullMQ (Redis)**
- Workers process jobs asynchronously and send via providers (SendGrid/Twilio/FCM/In-app)
- Admin APIs provide analytics, logs, retries, and AI tooling

### Run locally (Docker Compose)

From repo root:

```bash
docker compose up --build
```

API: `http://localhost:4000`

### Env vars

See `.env.example`.

### Notes

- Providers run in **mock mode** if credentials aren’t configured.
- Queue retries use **exponential backoff**. After max attempts, the job is moved to **DLQ**.

