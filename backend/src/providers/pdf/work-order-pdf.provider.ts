import PDFDocument from "pdfkit";

import { decimal, type DecimalLike } from "../../utils/money";

export type WorkOrderPdfData = {
  number: string;
  openedAt: string | Date;
  expectedAt?: string | Date | null;
  completedAt?: string | Date | null;
  problemDescription: string;
  equipmentName?: string | null;
  equipmentBrand?: string | null;
  equipmentModel?: string | null;
  equipmentIdentifier?: string | null;
  executionDescription?: string | null;
  clientNotes?: string | null;
  chargedAmount: DecimalLike;
  client?: Record<string, unknown>;
  technician?: { name: string } | null;
  items: Array<{ type: string; totalPrice: DecimalLike }>;
  company: Record<string, unknown>;
  logoBuffer?: Buffer;
};

const text = (value: unknown) => (value == null ? "" : String(value));
const currency = (value: DecimalLike) =>
  `R$ ${decimal(value)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

export function workOrderPdfTotals(order: WorkOrderPdfData) {
  const sum = (type: string) =>
    order.items
      .filter((item) => item.type === type)
      .reduce((total, item) => total.plus(item.totalPrice), decimal(0));
  const services = sum("SERVICE");
  const parts = sum("PRODUCT");
  return {
    services,
    parts,
    total: decimal(order.chargedAmount),
    adjustment: decimal(order.chargedAmount).minus(services).minus(parts),
  };
}

export class WorkOrderPdfProvider {
  async generate(order: WorkOrderPdfData): Promise<Buffer> {
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
      write(`Ordem de serviço Nº ${order.number} - continuação`, left, 32, width, true, 11);
      y = 62;
    };
    // Each row grows to fit its content. Long narrative fields continue on another page.
    const row = (cells: Array<{ label: string; value: string; width: number }>, minimum = 42) => {
      const h = Math.max(minimum, ...cells.map((cell) => height(cell.value, cell.width - 16) + 30));
      if (h > bottom - 62) {
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
    const field = (label: string, value: string, minimum = 38) => {
      let remaining = value;
      let continued = false;
      do {
        ensure(90);
        const available = bottom - y - 42;
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
        doc.rect(left, y, width, h).stroke();
        write(part, left + 8, y + 8, width - 16);
        y += h + 12;
        remaining = remaining.slice(take).trimStart();
        continued = true;
      } while (remaining);
    };

    const company = order.company;
    if (order.logoBuffer) {
      try {
        doc.image(order.logoBuffer, left, y, { fit: [120, 70] });
      } catch {
        /* Textual company identity remains visible if the logo is unsupported. */
      }
    }
    const companyLines = [
      company.companyName,
      company.address,
      company.cnpj ? `CNPJ: ${company.cnpj}` : "",
      [company.phone, company.whatsapp].filter(Boolean).join(" / "),
      company.email,
    ]
      .filter(Boolean)
      .map(text)
      .join("\n");
    write(companyLines, 210, y, 353);
    y += Math.max(82, height(companyLines, 353) + 16);
    write(`Ordem de serviço Nº ${order.number}`, left, y, width, true, 16);
    y += 40;

    const timezone = text(company.timezone) || "America/Sao_Paulo";
    const date = (value: string | Date | null | undefined, time = false) =>
      value
        ? new Intl.DateTimeFormat(
            "pt-BR",
            time
              ? { timeZone: timezone, hour: "2-digit", minute: "2-digit" }
              : { timeZone: timezone },
          ).format(new Date(value))
        : "";
    const client = order.client ?? {};
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
    row([
      { label: "Cliente", value: clientText, width: 260 },
      {
        label: "Dados da ordem de serviço",
        value: `Número da OS: ${order.number}\nData de entrada: ${date(order.openedAt)}    Hora: ${date(order.openedAt, true)}\nData prevista: ${date(order.expectedAt)}\nData de conclusão: ${date(order.completedAt)}    Hora: ${date(order.completedAt, true)}`,
        width: 271,
      },
    ]);
    row([
      {
        label: "Equipamento",
        value: [order.equipmentName, order.equipmentBrand, order.equipmentModel]
          .filter(Boolean)
          .join("\n"),
        width: 300,
      },
      {
        label: "Número de série / identificação",
        value: order.equipmentIdentifier ?? "",
        width: 231,
      },
    ]);
    field("Problema", order.problemDescription);
    const totals = workOrderPdfTotals(order);
    row([
      { label: "Total serviços", value: currency(totals.services), width: 160 },
      { label: "Total peças", value: currency(totals.parts), width: 160 },
      { label: "Total da ordem de serviço", value: currency(totals.total), width: 211 },
    ]);
    if (!totals.adjustment.isZero()) {
      ensure(30);
      write(
        `Ajustes no valor cobrado (acréscimos/descontos): ${currency(totals.adjustment)}`,
        left,
        y,
        width,
      );
      y += 26;
    }
    field("Observações do recebimento", "");
    field("Observações do serviço", order.clientNotes ?? "");
    field("Informações do técnico", order.executionDescription ?? "");
    ensure(100);
    write(`Técnico(s): ${order.technician?.name ?? ""}`, left, y, width, true, 11);
    y += 28;
    write("Concordo com os termos descritos acima.", left, y, width);
    y += 34;
    write("Data: _____ / _____ / __________", left, y, 240);
    doc
      .moveTo(325, y + 8)
      .lineTo(563, y + 8)
      .stroke();
    write("Assinatura do responsável", 355, y + 15, 208, false, 8);
    const pages = doc.bufferedPageRange();
    for (let index = 0; index < pages.count; index++) {
      doc.switchToPage(index);
      write(`${order.number} | Página ${index + 1} de ${pages.count}`, left, 793, width, false, 7);
    }
    doc.end();
    return result;
  }
}
