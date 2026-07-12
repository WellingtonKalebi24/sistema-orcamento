import multer from "multer";
import { Router } from "express";

import { env } from "../config/env";
import { CompanySettingsController } from "../controllers/company-settings.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { companySettingsInputSchema } from "../validators/company-settings.schemas";

const controller = new CompanySettingsController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.UPLOAD_MAX_BYTES },
});

export const companySettingsRouter = Router();

companySettingsRouter.get("/branding", (request, response) =>
  controller.branding(request, response),
);
companySettingsRouter.get("/branding/logo", (request, response) =>
  controller.downloadLogo(request, response),
);
companySettingsRouter.use(authenticate);
companySettingsRouter.get("/", (request, response) => controller.detail(request, response));
companySettingsRouter.get("/logo", (request, response) =>
  controller.downloadLogo(request, response),
);
companySettingsRouter.patch(
  "/",
  authorize("ADMIN"),
  validateBody(companySettingsInputSchema),
  (request, response) => controller.update(request, response),
);
companySettingsRouter.post(
  "/logo",
  authorize("ADMIN"),
  upload.single("file"),
  (request, response) => controller.logo(request, response),
);
