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
clientRouter.get("/:id", (request, response) => controller.detail(request, response));
clientRouter.get("/:id/history", (request, response) => controller.history(request, response));
clientRouter.patch(
  "/:id",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(clientInputSchema.partial()),
  (request, response) => controller.update(request, response),
);
clientRouter.delete("/:id", authorize("ADMIN"), (request, response) =>
  controller.remove(request, response),
);
