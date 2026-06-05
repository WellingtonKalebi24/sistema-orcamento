import { Router } from "express";

import { QuoteController } from "../controllers/quote.controller";
import { QuotePdfController } from "../controllers/quote-pdf.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { quoteInputSchema, quoteStatusSchema } from "../validators/quote.schemas";

const controller = new QuoteController();
const pdfController = new QuotePdfController();

export const quoteRouter = Router();

quoteRouter.use(authenticate);
quoteRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
quoteRouter.post(
  "/",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(quoteInputSchema),
  (request, response) => controller.create(request, response),
);
quoteRouter.get("/:id", (request, response) => controller.detail(request, response));
quoteRouter.patch(
  "/:id",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(quoteInputSchema),
  (request, response) => controller.update(request, response),
);
quoteRouter.patch(
  "/:id/status",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(quoteStatusSchema),
  (request, response) => controller.status(request, response),
);
quoteRouter.get("/:id/pdf", (request, response) => pdfController.download(request, response));
