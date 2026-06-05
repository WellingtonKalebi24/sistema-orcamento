import type { Request, Response } from "express";

import { CatalogService } from "../services/catalog.service";
import { ok } from "../utils/api-response";

const service = new CatalogService();

export class CatalogController {
  async list(request: Request, response: Response) {
    return ok(response, await service.list(String(request.query.search ?? "")));
  }
}
