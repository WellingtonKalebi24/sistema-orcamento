import {
  WorkOrderPdfProvider,
  workOrderPdfTotals,
} from "../../../src/providers/pdf/work-order-pdf.provider";
import { WorkOrderPdfService } from "../../../src/services/work-order-pdf.service";
import { workOrderPdfFixture as fixture } from "../../fixtures/work-order-pdf.fixture";

describe("PDF da ordem de serviço", () => {
  it("gera PDF mesmo sem logo ou com logo inválida", async () => {
    for (const logoBuffer of [undefined, Buffer.from("invalid")]) {
      const pdf = await new WorkOrderPdfProvider().generate({ ...fixture, logoBuffer });
      expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
      expect(pdf.toString("latin1")).toContain("/Count 1");
    }
  });

  it("continua descrições extensas em outras páginas", async () => {
    const pdf = await new WorkOrderPdfProvider().generate({
      ...fixture,
      problemDescription: "Descrição longa do defeito para análise técnica. ".repeat(300),
    });
    expect(pdf.toString("latin1")).not.toContain("/Count 1\n");
    expect(pdf.subarray(-6).toString()).toContain("%%EOF");
  });

  it("separa peças, serviços e ajustes sem usar custo interno como valor cobrado", () => {
    const totals = workOrderPdfTotals({ ...fixture, chargedAmount: "330.10" });
    expect(totals.services.toFixed(2)).toBe("200.00");
    expect(totals.parts.toFixed(2)).toBe("150.00");
    expect(totals.total.toFixed(2)).toBe("330.10");
    expect(totals.adjustment.toFixed(2)).toBe("-19.90");
  });

  it("usa a OS e a empresa cadastradas e tolera logo ausente no armazenamento", async () => {
    const orders = { findById: jest.fn().mockResolvedValue(fixture) };
    const settings = {
      getDefault: jest.fn().mockResolvedValue({ ...fixture.company, logoAttachmentId: "logo" }),
      downloadLogo: jest.fn().mockRejectedValue(new Error("missing")),
    };
    const provider = { generate: jest.fn().mockResolvedValue(Buffer.from("pdf")) };
    const service = new WorkOrderPdfService(orders as never, settings as never, provider as never);
    const result = await service.generate("order-id");
    expect(orders.findById).toHaveBeenCalledWith("order-id");
    expect(provider.generate).toHaveBeenCalledWith(
      expect.objectContaining({ number: fixture.number, logoBuffer: undefined }),
    );
    expect(result.fileName).toBe("ordem-servico-OS-2026-02378.pdf");
  });

  it("propaga OS inexistente sem gerar documento", async () => {
    const orders = { findById: jest.fn().mockRejectedValue(new Error("Ordem não encontrada")) };
    const provider = { generate: jest.fn() };
    const service = new WorkOrderPdfService(orders as never, undefined, provider as never);
    await expect(service.generate("missing")).rejects.toThrow("Ordem não encontrada");
    expect(provider.generate).not.toHaveBeenCalled();
  });
});
