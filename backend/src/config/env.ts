import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optional(name: string, fallback?: string): string | undefined {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v;
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development")!,
  port: Number(optional("PORT", "4000")),

  mongoUri: required("MONGO_URI"),
  redisUrl: required("REDIS_URL"),

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: optional("JWT_EXPIRES_IN", "12h")!,

  adminEmail: optional("ADMIN_EMAIL"),
  adminPassword: optional("ADMIN_PASSWORD"),

  sendgridApiKey: optional("SENDGRID_API_KEY"),
  sendgridFromEmail: optional("SENDGRID_FROM_EMAIL", "no-reply@example.com")!,

  twilioAccountSid: optional("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: optional("TWILIO_AUTH_TOKEN"),
  twilioFromPhone: optional("TWILIO_FROM_PHONE"),

  fcmProjectId: optional("FCM_PROJECT_ID"),
  fcmClientEmail: optional("FCM_CLIENT_EMAIL"),
  fcmPrivateKey: optional("FCM_PRIVATE_KEY")?.replace(/\\n/g, "\n"),

  openaiApiKey: optional("OPENAI_API_KEY"),
  openaiModel: optional("OPENAI_MODEL", "gpt-4.1-mini")!,

  userRateLimitPerMin: Number(optional("USER_NOTIF_RATE_LIMIT_PER_MINUTE", "10")),
  deliveryMaxAttempts: Number(optional("DELIVERY_MAX_ATTEMPTS", "5")),
};

