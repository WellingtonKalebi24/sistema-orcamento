import multer from "multer";
import { Router } from "express";

import { AttachmentController } from "../controllers/attachment.controller";
import { WorkOrderController } from "../controllers/work-order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { attachmentTypeSchema } from "../validators/attachment.schemas";
import {
  workOrderCompletionSchema,
  workOrderConversionSchema,
  workOrderInputSchema,
  workOrderUpdateSchema,
} from "../validators/work-order.schemas";

const controller = new WorkOrderController();
const attachmentController = new AttachmentController();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export const workOrderRouter = Router();

workOrderRouter.use(authenticate);
workOrderRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
workOrderRouter.post(
  "/",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(workOrderInputSchema),
  (request, response) => controller.create(request, response),
);
workOrderRouter.get("/:id", (request, response) => controller.detail(request, response));
workOrderRouter.patch(
  "/:id",
  authorize("ADMIN", "ATENDENTE", "TECNICO"),
  validateBody(workOrderUpdateSchema),
  (request, response) => controller.update(request, response),
);
workOrderRouter.post(
  "/quotes/:id/convert",
  authorize("ADMIN", "ATENDENTE"),
  validateBody(workOrderConversionSchema),
  (request, response) => controller.convertFromQuote(request, response),
);
workOrderRouter.post(
  "/:id/complete",
  authorize("ADMIN", "TECNICO"),
  validateBody(workOrderCompletionSchema),
  (request, response) => controller.complete(request, response),
);
workOrderRouter.get("/:id/attachments", (request, response) =>
  attachmentController.listByWorkOrder(request, response),
);
workOrderRouter.post(
  "/:id/attachments",
  authorize("ADMIN", "TECNICO"),
  upload.single("file"),
  validateBody(attachmentTypeSchema),
  (request, response) => attachmentController.upload(request, response),
);
workOrderRouter.get("/attachments/:id/download", (request, response) =>
  attachmentController.download(request, response),
);
workOrderRouter.delete("/attachments/:id", authorize("ADMIN", "TECNICO"), (request, response) =>
  attachmentController.remove(request, response),
);
