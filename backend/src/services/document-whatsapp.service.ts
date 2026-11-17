import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { QuotePdfService } from "./quote-pdf.service";
import { WorkOrderPdfService } from "./work-order-pdf.service";

export function normalizeWhatsapp(value: string) {
  let digits = value.replace(/\D/g, "");
  if (!value.trim().startsWith("+") && (digits.length === 10 || digits.length === 11))
    digits = `55${digits}`;
  if (!/^[1-9]\d{9,14}$/.test(digits))
    throw AppError.validation("Informe WhatsApp com DDD e codigo do pais.");
  return digits;
}

export class DocumentWhatsappService {
  async send(kind: "quote" | "work-order", id: string, phone: string) {
    if (!env.WAHA_URL)
      throw AppError.conflict(
        "WAHA nao configurado. Use Abrir WhatsApp ou configure o envio automatico na VPS.",
      );
    const recipient = normalizeWhatsapp(phone);
    const pdf =
      kind === "quote"
        ? await new QuotePdfService().generate(id)
        : await new WorkOrderPdfService().generate(id);
    let response: Response;
    try {
      response = await fetch(`${env.WAHA_URL.replace(/\/$/, "")}/api/sendFile`, {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
        headers: { "Content-Type": "application/json", "X-Api-Key": env.WAHA_API_KEY },
        body: JSON.stringify({
          session: env.WAHA_SESSION,
          chatId: `${recipient}@c.us`,
          file: {
            mimetype: "application/pdf",
            filename: pdf.fileName,
            data: pdf.buffer.toString("base64"),
          },
          caption:
            kind === "quote" ? "Segue o orcamento em PDF." : "Segue a ordem de servico em PDF.",
        }),
      });
    } catch {
      throw new AppError(
        "INTERNAL_ERROR",
        "Nao foi possivel confirmar o envio. Confira a conversa antes de tentar novamente.",
        502,
      );
    }
    if (!response.ok)
      throw new AppError(
        "INTERNAL_ERROR",
        "WAHA recusou o envio. Confira a sessao conectada e a configuracao do servidor.",
        502,
      );
    return { sent: true };
  }
}
