import type { Request, Response } from "express";

import { DashboardService } from "../services/dashboard.service";
import { ok } from "../utils/api-response";

const service = new DashboardService();

export class DashboardController {
  async summary(request: Request, response: Response) {
    return ok(response, await service.summary(request.user!.role));
  }
}
