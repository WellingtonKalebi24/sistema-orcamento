import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/common.schemas";
import { userInputSchema, userUpdateSchema } from "../validators/user.schemas";

const controller = new UserController();

export const userRouter = Router();

userRouter.use(authenticate, authorize("ADMIN"));
userRouter.get("/", validateQuery(paginationSchema), (request, response) =>
  controller.list(request, response),
);
userRouter.post("/", validateBody(userInputSchema), (request, response) =>
  controller.create(request, response),
);
userRouter.get("/:id", (request, response) => controller.detail(request, response));
userRouter.patch("/:id", validateBody(userUpdateSchema), (request, response) =>
  controller.update(request, response),
);
userRouter.delete("/:id", (request, response) => controller.remove(request, response));
