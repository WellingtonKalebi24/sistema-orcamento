import type { QuotePdfData } from "../../src/providers/pdf/quote-pdf.provider";

export const quotePdfFixture: QuotePdfData = {
  number: "ORC-2026-00001",
  issuedAt: "2026-10-19T12:00:00Z",
  validUntil: "2026-10-26T00:00:00Z",
  requestDescription:
    "Equipamento funciona por alguns minutos e desliga. Verificar alimentação e aquecimento.",
  itemsSubtotal: "120.00",
  laborAmount: "0.00",
  travelFee: "0.00",
  totalDiscount: "0.00",
  totalAmount: "120.00",
  paymentTerms: "50% na aprovação e 50% na entrega",
  executionDeadline: "A combinar",
  notes: "Entraremos em contato antes de executar serviços adicionais.",
  clientSnapshot: {
    name: "Cliente de demonstração",
    document: "000.000.000-00",
    street: "Rua Exemplo",
    number: "100",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 0000-0000",
  },
  companySnapshot: {
    companyName: "Pequenos Reparos",
    address: "Rua Exemplo, 100 - São Paulo/SP",
    phone: "(19) 0000-0000",
    email: "contato@example.com",
  },
  items: [
    {
      descriptionSnapshot: "Diagnóstico técnico",
      quantity: "1.000",
      unitPrice: "120.00",
      total: "120.00",
    },
  ],
};
