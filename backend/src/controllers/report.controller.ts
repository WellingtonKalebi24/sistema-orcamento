import type { Request, Response } from "express";

import { ReportService } from "../services/report.service";
import { ok } from "../utils/api-response";

const service = new ReportService();

export class ReportController {
  async summary(_request: Request, response: Response) {
    return ok(response, await service.summary());
  }
}
