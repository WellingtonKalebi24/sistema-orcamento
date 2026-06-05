import type { Request, Response } from "express";

import { isProduction } from "../config/env";
import { AuthService } from "../services/auth.service";
import { ok, noContent } from "../utils/api-response";

const authService = new AuthService();
const cookieName = "refreshToken";

function setRefreshCookie(response: Response, refreshToken: string) {
  response.cookie(cookieName, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/api/v1/auth",
  });
}

export class AuthController {
  async login(request: Request, response: Response) {
    const session = await authService.login(request.body);
    setRefreshCookie(response, session.refreshToken);
    return ok(response, { accessToken: session.accessToken, user: session.user });
  }

  async refresh(request: Request, response: Response) {
    const session = await authService.refresh(request.cookies?.[cookieName]);
    setRefreshCookie(response, session.refreshToken);
    return ok(response, { accessToken: session.accessToken, user: session.user });
  }

  async logout(request: Request, response: Response) {
    await authService.logout(request.cookies?.[cookieName]);
    response.clearCookie(cookieName, { path: "/api/v1/auth" });
    return noContent(response);
  }

  async me(request: Request, response: Response) {
    const user = await authService.currentUser(request.user!.id);
    return ok(response, user);
  }
}
