import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export function validateBody(schema: ZodTypeAny) {
  return (request: Request, _response: Response, next: NextFunction) => {
    request.body = schema.parse(request.body);
    next();
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const parsedQuery = schema.parse(request.query);

    Object.defineProperty(request, "query", {
      configurable: true,
      enumerable: true,
      value: parsedQuery,
    });
    next();
  };
}
