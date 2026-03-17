import { Queue } from "bullmq";
import { QUEUE_DEAD_LETTER } from "./names.js";
import { env } from "../config/env.js";

export const deadLetterQueue = new Queue(QUEUE_DEAD_LETTER, { connection: { url: env.redisUrl } });

