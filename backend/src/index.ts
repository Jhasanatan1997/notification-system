import { createApp } from "./app.js";
import { connectMongo } from "./database/mongoose.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { ensureSeedAdmin } from "./jobs/seedAdmin.js";

async function main() {
  await connectMongo();
  await ensureSeedAdmin();

  const app = createApp();
  app.listen(env.port, () => {
    logger.info({ port: env.port }, "API listening");
  });
}

main().catch((e) => {
  logger.error(e, "Fatal startup error");
  process.exit(1);
});

