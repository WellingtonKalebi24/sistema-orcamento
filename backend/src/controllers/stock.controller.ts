import type { Request, Response } from "express";

import { StockService } from "../services/stock.service";
import { created, ok } from "../utils/api-response";

const service = new StockService();

export class StockController {
  async list(request: Request, response: Response) {
    return ok(response, await service.list(request.query as never));
  }

  async create(request: Request, response: Response) {
    return created(
      response,
      await service.createManualMovement(String(request.params.id), request.body, request.user!.id),
    );
  }
}
