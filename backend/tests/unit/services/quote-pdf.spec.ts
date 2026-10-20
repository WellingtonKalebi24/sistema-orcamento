import { QuotePdfProvider } from "../../../src/providers/pdf/quote-pdf.provider";
import { QuotePdfService } from "../../../src/services/quote-pdf.service";
import { quotePdfFixture } from "../../fixtures/quote-pdf.fixture";

describe("Formulário PDF de orçamento", () => {
  it.each([null, { companyName: "Empresa na emissão" }])(
    "usa a empresa atual no rascunho e preserva o snapshot quando existente",
    async (companySnapshot) => {
      const quotes = {
        findById: jest.fn().mockResolvedValue({ ...quotePdfFixture, companySnapshot }),
      };
      const provider = { generate: jest.fn().mockResolvedValue(Buffer.from("pdf")) };
      const currentCompany = { companyName: "Empresa atual" };
      const company = { getDefault: jest.fn().mockResolvedValue(currentCompany) };
      const service = new QuotePdfService(
        quotes as never,
        provider as never,
        undefined,
        undefined,
        company as never,
      );
      await service.generate("quote-id");
      expect(provider.generate).toHaveBeenCalledWith(
        expect.objectContaining({ companySnapshot: companySnapshot ?? currentCompany }),
      );
    },
  );
  it.each([undefined, Buffer.from("invalid logo")])(
    "gera uma página A4 sem depender da logo",
    async (logoBuffer) => {
      const pdf = await new QuotePdfProvider().generate({ ...quotePdfFixture, logoBuffer });
      expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
      expect(pdf.toString("latin1")).toMatch(/\/Count 1\b/);
      expect(pdf.toString("latin1")).toContain("/MediaBox [0 0 595.28 841.89]");
    },
  );

  it("pagina descrições extensas e muitos itens", async () => {
    const pdf = await new QuotePdfProvider().generate({
      ...quotePdfFixture,
      requestDescription: "Relato extenso. ".repeat(600),
      items: Array.from({ length: 40 }, (_, index) => ({
        ...quotePdfFixture.items[0],
        descriptionSnapshot: `Item ${index + 1}`,
      })),
    });
    expect(pdf.toString("latin1")).not.toMatch(/\/Count 1\b/);
    expect(pdf.subarray(-6).toString()).toContain("%%EOF");
  });

  it("preserva itens com descrição maior que uma página", async () => {
    const pdf = await new QuotePdfProvider().generate({
      ...quotePdfFixture,
      items: [
        { ...quotePdfFixture.items[0], descriptionSnapshot: "Serviço detalhado. ".repeat(600) },
      ],
    });
    expect(pdf.toString("latin1")).not.toMatch(/\/Count 1\b/);
  });
});
