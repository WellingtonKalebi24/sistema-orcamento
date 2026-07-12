import PDFDocument from "pdfkit";

import { decimalToString } from "../../utils/money";

type QuotePdfData = {
  number: string;
  issuedAt: string | Date;
  validUntil: string | Date;
  requestDescription: string;
  itemsSubtotal: string;
  laborAmount: string;
  travelFee: string;
  totalDiscount: string;
  totalAmount: string;
  paymentTerms?: string | null;
  executionDeadline?: string | null;
  notes?: string | null;
  client?: Record<string, unknown>;
  clientSnapshot?: Record<string, unknown> | null;
  companySnapshot?: Record<string, unknown> | null;
  logoBuffer?: Buffer;
  items: Array<{
    descriptionSnapshot: string;
    quantity: string;
    unitPrice: string;
    total: string;
  }>;
};

function text(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export class QuotePdfProvider {
  async generate(quote: QuotePdfData) {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const company = quote.companySnapshot ?? {};
      if (quote.logoBuffer) {
        try {
          doc.image(quote.logoBuffer, 48, 42, { fit: [90, 55] });
          doc.x = 150;
        } catch {
          // A identidade textual continua disponivel quando a imagem for invalida.
        }
      }
      doc
        .fontSize(18)
        .text(text(company.companyName) || "Orcamento de Servicos", { align: "left" });
      doc.fontSize(10).text(text(company.address) || "Dados da empresa nao informados");
      doc.text(`Contato: ${text(company.phone)} ${text(company.whatsapp)} ${text(company.email)}`);
      doc.moveDown();

      doc.fontSize(16).text(`Orcamento ${quote.number}`);
      doc.fontSize(10).text(`Data: ${new Date(quote.issuedAt).toLocaleDateString("pt-BR")}`);
      doc.text(`Validade: ${new Date(quote.validUntil).toLocaleDateString("pt-BR")}`);
      doc.moveDown();

      const client = quote.clientSnapshot ?? quote.client ?? {};
      doc.fontSize(12).text("Cliente", { underline: true });
      doc.fontSize(10).text(text(client.name));
      doc.text(`Documento: ${text(client.document)}`);
      doc.text(`Contato: ${text(client.phone)} ${text(client.whatsapp)} ${text(client.email)}`);
      doc.moveDown();

      doc.fontSize(12).text("Solicitacao", { underline: true });
      doc.fontSize(10).text(quote.requestDescription);
      doc.moveDown();

      doc.fontSize(12).text("Itens", { underline: true });
      for (const item of quote.items) {
        doc
          .fontSize(10)
          .text(
            `${item.descriptionSnapshot} - Qtd ${decimalToString(item.quantity, 3)} x R$ ${decimalToString(item.unitPrice)} = R$ ${decimalToString(item.total)}`,
          );
      }
      doc.moveDown();

      doc.fontSize(12).text("Resumo financeiro", { underline: true });
      doc.fontSize(10).text(`Subtotal de itens: R$ ${decimalToString(quote.itemsSubtotal)}`);
      doc.text(`Mao de obra: R$ ${decimalToString(quote.laborAmount)}`);
      doc.text(`Deslocamento: R$ ${decimalToString(quote.travelFee)}`);
      doc.text(`Descontos: R$ ${decimalToString(quote.totalDiscount)}`);
      doc.fontSize(14).text(`Total final: R$ ${decimalToString(quote.totalAmount)}`);
      doc.moveDown();

      doc.fontSize(10).text(`Condicoes de pagamento: ${quote.paymentTerms ?? "A combinar"}`);
      doc.text(`Prazo de execucao: ${quote.executionDeadline ?? "A combinar"}`);
      if (quote.notes) doc.text(`Observacoes: ${quote.notes}`);
      doc.moveDown(2);
      doc.text("Aceite do cliente: ______________________________________");
      doc.moveDown();
      doc.text("Assinatura da empresa: __________________________________");
      doc.moveDown(2);
      doc.fontSize(8).text(text(company.defaultPdfFooter) || "Documento gerado pelo sistema.", {
        align: "center",
      });

      doc.end();
    });
  }
}
