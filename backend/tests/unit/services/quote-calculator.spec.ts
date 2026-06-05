import { QuoteCalculatorService } from "../../../src/services/quote-calculator.service";

describe("QuoteCalculatorService", () => {
  it("calcula itens, descontos, taxa, mao de obra, custo e lucro com decimal", () => {
    const calculator = new QuoteCalculatorService();

    const result = calculator.calculate({
      items: [
        {
          type: "SERVICE",
          serviceId: "service-id",
          descriptionSnapshot: "Instalacao",
          quantity: "2.000",
          unitPrice: "150.00",
          unitCost: "0.00",
          discountAmount: "10.00",
        },
        {
          type: "PRODUCT",
          productId: "product-id",
          descriptionSnapshot: "Peca",
          unitSnapshot: "UN",
          quantity: "3.000",
          unitPrice: "80.00",
          unitCost: "30.00",
          discountAmount: "0.00",
        },
      ],
      laborAmount: "100.00",
      travelFee: "50.00",
      generalDiscount: "20.00",
    });

    expect(result.totals).toEqual({
      laborAmount: "100.00",
      travelFee: "50.00",
      generalDiscount: "20.00",
      itemsSubtotal: "540.00",
      totalDiscount: "30.00",
      totalAmount: "660.00",
      estimatedCost: "90.00",
      estimatedProfit: "570.00",
    });
  });

  it("bloqueia desconto que deixa total negativo", () => {
    const calculator = new QuoteCalculatorService();

    expect(() =>
      calculator.calculate({
        items: [
          {
            type: "SERVICE",
            serviceId: "service-id",
            descriptionSnapshot: "Servico",
            quantity: "1.000",
            unitPrice: "10.00",
            unitCost: "0.00",
            discountAmount: "20.00",
          },
        ],
        laborAmount: "0.00",
        travelFee: "0.00",
        generalDiscount: "0.00",
      }),
    ).toThrow("Desconto do item");
  });
});
