import { Router } from "express";

import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const controller = new DashboardController();

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.get("/summary", (request, response) => controller.summary(request, response));
