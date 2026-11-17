import { QuoteService } from "../../../src/services/quote.service";
import { WorkOrderService } from "../../../src/services/work-order.service";
import {
  workOrderInputSchema,
  workOrderUpdateSchema,
} from "../../../src/validators/work-order.schemas";
import {
  DocumentWhatsappService,
  normalizeWhatsapp,
} from "../../../src/services/document-whatsapp.service";
import { QuotePdfService } from "../../../src/services/quote-pdf.service";
import { env } from "../../../src/config/env";

describe("Gerenciamento de documentos", () => {
  it("edicao parcial do equipamento preserva itens e valores omitidos", () => {
    const parsed = workOrderUpdateSchema.parse({ equipmentName: "Televisor" });
    expect(parsed).toEqual({ equipmentName: "Televisor" });
  });
  it("abre OS de recebimento sem itens", () => {
    expect(
      workOrderInputSchema.parse({
        clientId: "12345678-1234-4234-8234-123456789012",
        problemDescription: "Nao liga",
      }).items,
    ).toEqual([]);
  });
  it("exclui orcamento preservando registro e itens", async () => {
    const updateStatus = jest.fn();
    const service = new QuoteService({
      findById: jest.fn().mockResolvedValue({ payments: [] }),
      updateStatus,
    } as never);
    await service.remove("quote", "user");
    expect(updateStatus).toHaveBeenCalledWith("quote", {
      deletedAt: expect.any(Date),
      updatedById: "user",
    });
  });
  it.each([{ workOrder: { id: "os" } }, { payments: [{}] }])(
    "protege orcamento vinculado %j",
    async (current) => {
      const updateStatus = jest.fn();
      const service = new QuoteService({
        findById: jest.fn().mockResolvedValue(current),
        updateStatus,
      } as never);
      await expect(service.remove("quote", "user")).rejects.toThrow("vinculados");
      await expect(service.updateDraft("quote", {} as never, "user")).rejects.toThrow("vinculados");
      expect(updateStatus).not.toHaveBeenCalled();
    },
  );
  it.each([{ status: "CONCLUIDA" }, { stockDeductedAt: new Date() }, { payments: [{}] }])(
    "protege OS com efeitos financeiros %j",
    async (current) => {
      const update = jest.fn();
      const service = new WorkOrderService({
        findById: jest.fn().mockResolvedValue(current),
        update,
      } as never);
      await expect(service.remove("os", "user")).rejects.toThrow("nao pode ser excluida");
      expect(update).not.toHaveBeenCalled();
    },
  );
  it("retira OS aberta das listas sem apagar itens", async () => {
    const update = jest.fn();
    const service = new WorkOrderService({
      findById: jest.fn().mockResolvedValue({ status: "ABERTA" }),
      update,
    } as never);
    await service.remove("os", "user");
    expect(update).toHaveBeenCalledWith("os", {
      deletedAt: expect.any(Date),
      status: "CANCELADA",
      updatedById: "user",
    });
  });
});

describe("Envio WAHA", () => {
  const originalUrl = env.WAHA_URL;
  afterEach(() => {
    env.WAHA_URL = originalUrl;
    jest.restoreAllMocks();
  });
  it("normaliza telefone brasileiro e rejeita destino invalido", () => {
    expect(normalizeWhatsapp("(19) 99999-1234")).toBe("5519999991234");
    expect(() => normalizeWhatsapp("abc")).toThrow("DDD");
  });
  it("envia o PDF em base64 somente ao destino informado", async () => {
    env.WAHA_URL = "http://waha.test";
    jest
      .spyOn(QuotePdfService.prototype, "generate")
      .mockResolvedValue({ fileName: "orcamento.pdf", buffer: Buffer.from("%PDF") });
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);
    await expect(new DocumentWhatsappService().send("quote", "id", "19999991234")).resolves.toEqual(
      { sent: true },
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
    expect(body.chatId).toBe("5519999991234@c.us");
    expect(body.file).toEqual({
      mimetype: "application/pdf",
      filename: "orcamento.pdf",
      data: Buffer.from("%PDF").toString("base64"),
    });
  });
  it("nao informa sucesso quando WAHA rejeita", async () => {
    env.WAHA_URL = "http://waha.test";
    jest
      .spyOn(QuotePdfService.prototype, "generate")
      .mockResolvedValue({ fileName: "a.pdf", buffer: Buffer.from("%PDF") });
    jest.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);
    await expect(new DocumentWhatsappService().send("quote", "id", "19999991234")).rejects.toThrow(
      "recusou",
    );
  });
});
