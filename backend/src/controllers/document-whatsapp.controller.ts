import type { Request, Response } from "express";
import { DocumentWhatsappService } from "../services/document-whatsapp.service";
import { ok } from "../utils/api-response";
const service = new DocumentWhatsappService();
export class DocumentWhatsappController {
  async send(kind: "quote" | "work-order", request: Request, response: Response) {
    return ok(response, await service.send(kind, String(request.params.id), request.body.phone));
  }
}
