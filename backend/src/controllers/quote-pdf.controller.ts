import type { Request, Response } from "express";

import { QuotePdfService } from "../services/quote-pdf.service";

const service = new QuotePdfService();

export class QuotePdfController {
  async download(request: Request, response: Response) {
    const pdf = await service.generate(String(request.params.id));
    response.setHeader("content-type", "application/pdf");
    response.setHeader("content-disposition", `attachment; filename="${pdf.fileName}"`);
    return response.send(pdf.buffer);
  }
}
