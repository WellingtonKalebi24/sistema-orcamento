import { Router } from "express";

import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { productInputSchema, productUpdateSchema } from "../validators/product.schemas";

const controller = new ProductController();

export const productRouter = Router();

productRouter.use(authenticate);
productRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
productRouter.get("/low-stock", (request, response) => controller.lowStock(request, response));
productRouter.post("/", authorize("ADMIN"), validateBody(productInputSchema), (request, response) =>
  controller.create(request, response),
);
productRouter.get("/:id", (request, response) => controller.detail(request, response));
productRouter.patch(
  "/:id",
  authorize("ADMIN"),
  validateBody(productUpdateSchema),
  (request, response) => controller.update(request, response),
);
productRouter.delete("/:id", authorize("ADMIN"), (request, response) =>
  controller.remove(request, response),
);
