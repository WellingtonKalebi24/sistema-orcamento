import { Router } from "express";

import { ServiceController } from "../controllers/service.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { serviceInputSchema, serviceUpdateSchema } from "../validators/service.schemas";

const controller = new ServiceController();

export const serviceRouter = Router();

serviceRouter.use(authenticate);
serviceRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
serviceRouter.post("/", authorize("ADMIN"), validateBody(serviceInputSchema), (request, response) =>
  controller.create(request, response),
);
serviceRouter.get("/:id", (request, response) => controller.detail(request, response));
serviceRouter.patch(
  "/:id",
  authorize("ADMIN"),
  validateBody(serviceUpdateSchema),
  (request, response) => controller.update(request, response),
);
serviceRouter.delete("/:id", authorize("ADMIN"), (request, response) =>
  controller.remove(request, response),
);
