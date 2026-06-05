import type { Request, Response } from "express";

import { QuoteService } from "../services/quote.service";
import { created, ok } from "../utils/api-response";

const service = new QuoteService();

export class QuoteController {
  async list(request: Request, response: Response) {
    return ok(response, await service.list(request.query as never));
  }

  async create(request: Request, response: Response) {
    return created(response, await service.create(request.body, request.user!.id));
  }

  async detail(request: Request, response: Response) {
    return ok(response, await service.findById(String(request.params.id)));
  }

  async update(request: Request, response: Response) {
    return ok(
      response,
      await service.updateDraft(String(request.params.id), request.body, request.user!.id),
    );
  }

  async status(request: Request, response: Response) {
    return ok(
      response,
      await service.changeStatus(String(request.params.id), request.body.status, request.user!.id),
    );
  }
}
