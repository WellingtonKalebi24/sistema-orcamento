import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authRateLimit } from "../middlewares/security.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth.schemas";

const controller = new AuthController();

export const authRouter = Router();

authRouter.post("/login", authRateLimit, validateBody(loginSchema), (request, response) =>
  controller.login(request, response),
);
authRouter.post("/refresh", authRateLimit, (request, response) =>
  controller.refresh(request, response),
);
authRouter.post("/logout", authenticate, (request, response) =>
  controller.logout(request, response),
);
authRouter.get("/me", authenticate, (request, response) => controller.me(request, response));
