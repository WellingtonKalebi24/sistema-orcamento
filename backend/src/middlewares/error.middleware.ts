import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "../config/logger";
import { AppError } from "../utils/app-error";

export function notFoundMiddleware(request: Request, _response: Response, next: NextFunction) {
  next(AppError.notFound(`Rota ${request.method} ${request.path} nao encontrada.`));
}

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  void _next;
  if (error instanceof ZodError) {
    return response.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Dados invalidos.",
        details: error.issues,
      },
      requestId: request.requestId,
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      requestId: request.requestId,
    });
  }

  logger.error({ error, requestId: request.requestId }, "Erro interno nao tratado");

  return response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Nao foi possivel concluir a operacao.",
      details: [],
    },
    requestId: request.requestId,
  });
}
