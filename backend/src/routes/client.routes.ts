import { Router } from "express";

import { ClientController } from "../controllers/client.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { clientInputSchema } from "../validators/client.schemas";

const controller = new ClientController();

export const clientRouter = Router();

clientRouter.use(authenticate);
clientRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
clientRouter.post(
  "/",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(clientInputSchema),
  (request, response) => controller.create(request, response),
);
