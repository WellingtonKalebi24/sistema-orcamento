import { QuoteService } from "../../../src/services/quote.service";

describe("Recusa de orcamentos", () => {
  it.each(["RASCUNHO", "ENVIADO"])("permite recusar %s sem alterar itens ou valores", async (status) => {
    const updateStatus = jest.fn().mockResolvedValue({ id: "quote", status: "RECUSADO" });
    const service = new QuoteService({
      findById: jest.fn().mockResolvedValue({ id: "quote", status }),
      updateStatus,
    } as never);
    await service.changeStatus("quote", "RECUSADO", "user");
    expect(updateStatus).toHaveBeenCalledWith("quote", { status: "RECUSADO", updatedById: "user" });
  });

  it.each(["APROVADO", "RECUSADO", "EXPIRADO"])("preserva orcamento finalizado %s", async (status) => {
    const updateStatus = jest.fn();
    const service = new QuoteService({
      findById: jest.fn().mockResolvedValue({ id: "quote", status }),
      updateStatus,
    } as never);
    await expect(service.changeStatus("quote", "RECUSADO", "user")).rejects.toThrow();
    expect(updateStatus).not.toHaveBeenCalled();
  });
});
