import type { Request, Response } from "express";

import { ProductService } from "../services/product.service";
import { created, ok } from "../utils/api-response";

const service = new ProductService();

export class ProductController {
  async list(request: Request, response: Response) {
    const query = request.query as Record<string, unknown>;
    return ok(
      response,
      await service.list({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 20),
        search: typeof query.search === "string" ? query.search : undefined,
        status: typeof query.status === "string" ? query.status : undefined,
        lowStock: String(request.query.lowStock ?? "") === "true",
      }),
    );
  }

  async lowStock(_request: Request, response: Response) {
    return ok(response, await service.lowStock());
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
