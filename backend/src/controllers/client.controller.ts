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
}
