import { connectMongo } from "./database/mongoose.js";
import { logger } from "./config/logger.js";
import { startNotificationWorker } from "./workers/notificationWorker.js";

async function main() {
  await connectMongo();
  startNotificationWorker();
}

main().catch((e) => {
  logger.error(e, "Fatal worker startup error");
  process.exit(1);
});

