import type { Request, Response } from "express";

import { ClientService } from "../services/client.service";
import { created, ok } from "../utils/api-response";

const service = new ClientService();

export class ClientController {
  async list(request: Request, response: Response) {
    return ok(response, await service.list(request.query as never));
  }

  async create(request: Request, response: Response) {
    return created(response, await service.create(request.body));
  }

  async detail(request: Request, response: Response) {
    return ok(response, await service.findById(String(request.params.id)));
  }

  async update(request: Request, response: Response) {
    return ok(response, await service.update(String(request.params.id), request.body));
  }

  async remove(request: Request, response: Response) {
    return ok(response, await service.remove(String(request.params.id)));
  }

  async history(request: Request, response: Response) {
    return ok(response, await service.history(String(request.params.id)));
  }
}
