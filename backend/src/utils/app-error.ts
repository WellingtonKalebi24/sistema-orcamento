export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INSUFFICIENT_STOCK"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly statusCode = 500,
    public readonly details: unknown[] = [],
  ) {
    super(message);
  }

  static validation(message = "Dados invalidos.", details: unknown[] = []) {
    return new AppError("VALIDATION_ERROR", message, 400, details);
  }

  static unauthorized(message = "Autenticacao obrigatoria.") {
    return new AppError("UNAUTHORIZED", message, 401);
  }

  static forbidden(message = "Voce nao possui permissao para esta acao.") {
    return new AppError("FORBIDDEN", message, 403);
  }

  static notFound(message = "Registro nao encontrado.") {
    return new AppError("NOT_FOUND", message, 404);
  }

  static conflict(message = "A operacao conflita com o estado atual.") {
    return new AppError("CONFLICT", message, 409);
  }
}
