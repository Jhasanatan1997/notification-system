## API Reference

Base URL: `http://localhost:4000`

### Health

- **GET** `/healthz`

### Admin Auth

- **POST** `/auth/login`

Body:

```json
{ "email": "admin@local.dev", "password": "admin12345" }
```

Response:

```json
{ "token": "JWT..." }
```

### Create notification

- **POST** `/notifications`

Body:

```json
{
  "userId": "123",
  "type": "ORDER_PLACED",
  "channels": ["email", "push"],
  "data": { "orderId": "456" },
  "scheduledAt": "2026-03-17T09:00:00.000Z"
}
```

Notes:

- Respects user preferences.
- Enforces rate limit per user/minute.
- Idempotent via computed `idempotencyKey` (or provide one).

### Batch notifications

- **POST** `/notifications/batch`

Body:

```json
{ "notifications": [ { "...": "..." }, { "...": "..." } ] }
```

### Admin: list notifications

- **GET** `/notifications?userId=&status=&type=&limit=&offset=`
- Requires `Authorization: Bearer <token>`

### Admin: notification logs

- **GET** `/notifications/:notificationId/logs`
- Requires admin JWT

### Admin: templates

- **GET** `/templates`
- **PUT** `/templates`
- **DELETE** `/templates/:type/:channel`

### Admin: overview + retry

- **GET** `/admin/overview`
- **GET** `/admin/logs?channel=&status=&notificationId=&limit=&offset=`
- **POST** `/admin/notifications/:notificationId/retry`

### Admin: AI tools

- **POST** `/ai/generate-message`
- **POST** `/ai/detect-spam`
- **POST** `/ai/predict-engagement`
- **POST** `/ai/best-send-time`

