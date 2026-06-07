import type { Request, Response } from "express";

import { WorkOrderCompletionService } from "../services/work-order-completion.service";
import { WorkOrderService } from "../services/work-order.service";
import { created, ok } from "../utils/api-response";

const service = new WorkOrderService();
const completionService = new WorkOrderCompletionService();

export class WorkOrderController {
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
      await service.update(String(request.params.id), request.body, request.user!.id),
    );
  }

  async convertFromQuote(request: Request, response: Response) {
    return created(
      response,
      await service.convertFromQuote(String(request.params.id), request.body, request.user!.id),
    );
  }

  async complete(request: Request, response: Response) {
    return ok(
      response,
      await completionService.complete(String(request.params.id), request.body, request.user!.id),
    );
  }
}
