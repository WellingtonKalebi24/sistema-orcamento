import type { Request, Response } from "express";

import { AttachmentService } from "../services/attachment.service";
import { created, noContent, ok } from "../utils/api-response";

const service = new AttachmentService();

export class AttachmentController {
  async listByWorkOrder(request: Request, response: Response) {
    return ok(response, await service.listByWorkOrder(String(request.params.id)));
  }

  async upload(request: Request, response: Response) {
    return created(
      response,
      await service.upload(String(request.params.id), request.file, request.body, request.user!.id),
    );
  }

  async download(request: Request, response: Response) {
    const { attachment, buffer } = await service.download(String(request.params.id));
    response.setHeader("Content-Type", attachment.mimeType);
    response.setHeader("Content-Disposition", `attachment; filename="${attachment.originalName}"`);
    return response.send(buffer);
  }

  async remove(request: Request, response: Response) {
    await service.remove(String(request.params.id));
    return noContent(response);
  }
}
