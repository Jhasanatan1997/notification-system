import IORedis from "ioredis";
import { env } from "../config/env.js";

export const redis =
  env.nodeEnv === "test"
    ? ({
        incr: async () => 1,
        expire: async () => 1,
      } as any)
    : new IORedis(env.redisUrl, {
        maxRetriesPerRequest: null,
      });

