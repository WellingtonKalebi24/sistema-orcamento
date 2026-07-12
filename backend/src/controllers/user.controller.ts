import type { Request, Response } from "express";

import { UserService } from "../services/user.service";
import { created, ok } from "../utils/api-response";

const service = new UserService();

export class UserController {
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
}
