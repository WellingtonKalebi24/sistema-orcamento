import PDFDocument from "pdfkit";

import { decimalToString } from "../../utils/money";

export type QuotePdfData = {
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

const currency = (value: string) =>
  `R$ ${decimalToString(value)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

export class QuotePdfProvider {
  async generate(quote: QuotePdfData): Promise<Buffer> {
    const doc = new PDFDocument({ size: "A4", margin: 32, bufferPages: true });
    const chunks: Buffer[] = [];
    const result = new Promise<Buffer>((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
    const left = 32,
      width = 531,
      bottom = 770;
    let y = 32;
    const font = (bold = false, size = 9) =>
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size);
    const write = (value: string, x: number, top: number, w: number, bold = false, size = 9) => {
      font(bold, size).text(value, x, top, { width: w, lineGap: 2 });
    };
    const height = (value: string, w: number) =>
      font().heightOfString(value || " ", { width: w, lineGap: 2 });
    const ensure = (needed: number) => {
      if (y + needed <= bottom) return;
      doc.addPage();
      write(`Orçamento Nº ${quote.number} - continuação`, left, 32, width, true, 11);
      y = 62;
    };
    const field = (label: string, value: string, minimum = 32) => {
      let remaining = value;
      let continued = false;
      do {
        ensure(90);
        const available = bottom - y - 44;
        let take = remaining.length;
        if (height(remaining, width - 16) > available) {
          let lo = 1,
            hi = take;
          while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            if (height(remaining.slice(0, mid), width - 16) <= available) lo = mid;
            else hi = mid - 1;
          }
          take = lo;
          const space = remaining.lastIndexOf(" ", take);
          if (space > take / 2) take = space;
        }
        const part = remaining.slice(0, take);
        write(label + (continued ? " (continuação)" : ""), left, y, width, true);
        y += 16;
        const h = Math.max(minimum, height(part, width - 16) + 16);
        doc.lineWidth(0.6).rect(left, y, width, h).stroke();
        write(part, left + 8, y + 8, width - 16);
        y += h + 12;
        remaining = remaining.slice(take).trimStart();
        continued = true;
      } while (remaining);
    };
    const row = (cells: Array<{ label: string; value: string; width: number }>) => {
      const h = Math.max(44, ...cells.map((cell) => height(cell.value, cell.width - 16) + 30));
      if (h > bottom - 74) {
        for (const cell of cells) field(cell.label, cell.value);
        return;
      }
      ensure(h + 12);
      let x = left;
      for (const cell of cells) {
        doc.lineWidth(0.6).rect(x, y, cell.width, h).stroke();
        write(cell.label, x + 8, y + 7, cell.width - 16, true, 8);
        write(cell.value, x + 8, y + 23, cell.width - 16);
        x += cell.width;
      }
      y += h + 12;
    };
    const company = quote.companySnapshot ?? {};
    if (quote.logoBuffer) {
      try {
        doc.image(quote.logoBuffer, left, y, { fit: [120, 70] });
      } catch {
        /* The company name remains visible if the logo is invalid. */
      }
    }
    const companyText = [
      text(company.companyName) || "Orçamento de serviços",
      company.address,
      company.cnpj ? `CNPJ: ${text(company.cnpj)}` : "",
      [company.phone, company.whatsapp].filter(Boolean).join(" / "),
      company.email,
    ]
      .filter(Boolean)
      .map(text)
      .join("\n");
    write(companyText, 210, y, 353);
    y += Math.max(82, height(companyText, 353) + 16);
    font(true, 16).text(`Orçamento Nº ${quote.number}`, left, y, { width, align: "center" });
    y += 38;
    const client = quote.clientSnapshot ?? quote.client ?? {};
    const clientText = [
      client.name,
      client.document,
      [client.street, client.number, client.complement].filter(Boolean).join(", "),
      [client.district, client.city, client.state, client.zipCode].filter(Boolean).join(" - "),
      [client.phone, client.whatsapp, client.email].filter(Boolean).join(" / "),
    ]
      .filter(Boolean)
      .map(text)
      .join("\n");
    const date = (value: string | Date, calendarDate = false) =>
      new Intl.DateTimeFormat("pt-BR", {
        timeZone: calendarDate ? "UTC" : text(company.timezone) || "America/Sao_Paulo",
      }).format(new Date(value));
    row([
      { label: "Cliente", value: clientText, width: 310 },
      {
        label: "Dados do orçamento",
        value: `Número: ${quote.number}\nEmissão: ${date(quote.issuedAt)}\nValidade: ${date(quote.validUntil, true)}`,
        width: 221,
      },
    ]);
    field("Solicitação / problema relatado", quote.requestDescription);

    // Repeat table labels on new pages and preserve very long descriptions as boxed fields.
    const widths = [273, 65, 93, 100];
    const tableHeader = () => {
      let x = left;
      ["Descrição dos itens", "Qtd.", "Valor unitário", "Total"].forEach((label, index) => {
        doc.rect(x, y, widths[index], 23).stroke();
        write(label, x + 7, y + 7, widths[index] - 14, true, 8);
        x += widths[index];
      });
      y += 23;
    };
    let headerNeeded = true;
    for (const item of quote.items) {
      const values = [
        item.descriptionSnapshot,
        decimalToString(item.quantity, 3).replace(".", ","),
        currency(item.unitPrice),
        currency(item.total),
      ];
      const h = Math.max(27, ...values.map((value, i) => height(value, widths[i] - 14) + 14));
      if (h > 650) {
        field("Descrição do item", item.descriptionSnapshot);
        row([
          { label: "Quantidade", value: values[1], width: 177 },
          { label: "Valor unitário", value: values[2], width: 177 },
          { label: "Total do item", value: values[3], width: 177 },
        ]);
        headerNeeded = true;
        continue;
      }
      if (y + h + (headerNeeded ? 23 : 0) > bottom) {
        ensure(bottom);
        headerNeeded = true;
      }
      if (headerNeeded) {
        tableHeader();
        headerNeeded = false;
      }
      let x = left;
      values.forEach((value, index) => {
        doc.rect(x, y, widths[index], h).stroke();
        write(value, x + 7, y + 7, widths[index] - 14);
        x += widths[index];
      });
      y += h;
    }
    y += 12;
    row([
      { label: "Subtotal dos itens", value: currency(quote.itemsSubtotal), width: 177 },
      { label: "Mão de obra", value: currency(quote.laborAmount), width: 177 },
      { label: "Deslocamento", value: currency(quote.travelFee), width: 177 },
    ]);
    row([
      { label: "Descontos", value: currency(quote.totalDiscount), width: 177 },
      { label: "Total do orçamento", value: currency(quote.totalAmount), width: 354 },
    ]);
    row([
      { label: "Condições de pagamento", value: quote.paymentTerms || "A combinar", width: 310 },
      { label: "Prazo de execução", value: quote.executionDeadline || "A combinar", width: 221 },
    ]);
    field("Observações", quote.notes ?? "");
    if (company.defaultPdfFooter) field("Informações adicionais", text(company.defaultPdfFooter));
    ensure(85);
    write("Concordo com os termos descritos acima.", left, y, width);
    y += 22;
    write("Data: _____ / _____ / __________", left, y, width);
    y += 30;
    doc.moveTo(left, y).lineTo(278, y).stroke();
    doc.moveTo(317, y).lineTo(563, y).stroke();
    write("Assinatura do cliente", left, y + 7, 246, false, 8);
    write("Assinatura da empresa", 317, y + 7, 246, false, 8);
    const pages = doc.bufferedPageRange();
    for (let index = 0; index < pages.count; index++) {
      doc.switchToPage(index);
      write(`${quote.number} | Página ${index + 1} de ${pages.count}`, left, 793, width, false, 7);
    }
    doc.end();
    return result;
  }
}
