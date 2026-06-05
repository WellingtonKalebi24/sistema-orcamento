import type { NextFunction, Request, Response } from "express";

import { TokenProvider } from "../providers/auth/token.provider";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";

const tokenProvider = new TokenProvider();
const userRepository = new UserRepository();

export async function authenticate(request: Request, _response: Response, next: NextFunction) {
  const header = request.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return next(AppError.unauthorized());

  try {
    const payload = await tokenProvider.verifyAccessToken(token);
    const user = await userRepository.findActiveById(payload.sub);
    if (!user) return next(AppError.unauthorized());
    request.user = { id: user.id, email: user.email, role: user.role };
    return next();
  } catch {
    return next(AppError.unauthorized("Token invalido ou expirado."));
  }
}
