import type { Request, Response } from "express";

import { PaymentService } from "../services/payment.service";
import { created, ok } from "../utils/api-response";

const service = new PaymentService();

export class PaymentController {
  async list(request: Request, response: Response) {
    return ok(response, await service.list(request.query as never));
  }

  async create(request: Request, response: Response) {
    return created(response, await service.create(request.body, request.user!.id));
  }

  async update(request: Request, response: Response) {
    return ok(
      response,
      await service.update(String(request.params.id), request.body, request.user!.id),
    );
  }
}
