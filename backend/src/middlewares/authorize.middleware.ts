import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "../types/domain";
import { AppError } from "../utils/app-error";

export function authorize(...roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) return next(AppError.unauthorized());
    if (!roles.includes(request.user.role)) return next(AppError.forbidden());
    return next();
  };
}
