import { Router } from "express";

import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { paymentInputSchema, paymentUpdateSchema } from "../validators/payment.schemas";

const controller = new PaymentController();

export const paymentRouter = Router();

paymentRouter.use(authenticate, authorize("ADMIN", "FINANCEIRO"));
paymentRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
paymentRouter.post("/", validateBody(paymentInputSchema), (request, response) =>
  controller.create(request, response),
);
paymentRouter.patch("/:id", validateBody(paymentUpdateSchema), (request, response) =>
  controller.update(request, response),
);
