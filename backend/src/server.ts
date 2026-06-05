import "dotenv/config";

import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const port = env.PORT;
const app = createApp();

app.listen(port, () => {
  logger.info(`API disponivel em http://localhost:${port}.`);
});
