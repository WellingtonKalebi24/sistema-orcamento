import type { Request, Response } from "express";

import { CompanySettingsService } from "../services/company-settings.service";
import { ok } from "../utils/api-response";

const service = new CompanySettingsService();

export class CompanySettingsController {
  async branding(_request: Request, response: Response) {
    return ok(response, await service.getBranding());
  }

  async detail(_request: Request, response: Response) {
    return ok(response, await service.getDefault());
  }

  async update(request: Request, response: Response) {
    return ok(response, await service.update(request.body));
  }

  async logo(request: Request, response: Response) {
    return ok(response, await service.uploadLogo(request.file, request.user!.id));
  }

  async downloadLogo(_request: Request, response: Response) {
    const { attachment, buffer } = await service.downloadLogo();
    response.setHeader("Content-Type", attachment.mimeType);
    response.setHeader("Cache-Control", "private, max-age=300");
    return response.send(buffer);
  }
}
