import { Router } from "express";

import { ReportController } from "../controllers/report.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const controller = new ReportController();

export const reportRouter = Router();

reportRouter.use(authenticate, authorize("ADMIN", "FINANCEIRO"));
reportRouter.get("/", (request, response) => controller.summary(request, response));
reportRouter.get("/:reportType", (request, response) => controller.summary(request, response));
