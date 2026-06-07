import { Router } from "express";

import { StockController } from "../controllers/stock.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { stockMovementInputSchema } from "../validators/stock.schemas";

const controller = new StockController();

export const stockRouter = Router();

stockRouter.use(authenticate);
stockRouter.get(
  "/stock-movements",
  authorize("ADMIN", "FINANCEIRO"),
  validateQuery(paginationSchema),
  (request, response) => controller.list(request, response),
);
stockRouter.post(
  "/products/:id/stock-movements",
  authorize("ADMIN"),
  validateBody(stockMovementInputSchema),
  (request, response) => controller.create(request, response),
);
