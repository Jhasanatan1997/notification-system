import { env } from "../config/env.js";
import { redis } from "../queues/redis.js";
import { AppError } from "../utils/errors.js";

export async function enforceUserRateLimit(userId: string) {
  const key = `rate:notif:user:${userId}:${new Date().toISOString().slice(0, 16)}`; // minute bucket
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 70);
  }
  if (count > env.userRateLimitPerMin) {
    throw new AppError("Rate limit exceeded for user", 429, "RATE_LIMITED");
  }
}

