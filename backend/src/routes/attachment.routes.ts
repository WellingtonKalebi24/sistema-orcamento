import { Router } from "express";

import { AttachmentController } from "../controllers/attachment.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const controller = new AttachmentController();

export const attachmentRouter = Router();

attachmentRouter.use(authenticate);
attachmentRouter.get("/:id/download", (request, response) =>
  controller.download(request, response),
);
attachmentRouter.delete("/:id", authorize("ADMIN", "TECNICO"), (request, response) =>
  controller.remove(request, response),
);
