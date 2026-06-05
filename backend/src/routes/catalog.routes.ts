import { Router } from "express";

import { CatalogController } from "../controllers/catalog.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const controller = new CatalogController();

export const catalogRouter = Router();

catalogRouter.use(authenticate);
catalogRouter.get("/", (request, response) => controller.list(request, response));
