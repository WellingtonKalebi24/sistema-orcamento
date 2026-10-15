import type { WorkOrderPdfData } from "../../src/providers/pdf/work-order-pdf.provider";

export const workOrderPdfFixture: WorkOrderPdfData = {
  number: "OS-2026-02378",
  openedAt: "2026-10-15T13:30:00Z",
  expectedAt: "2026-10-20T15:00:00Z",
  problemDescription:
    "Liga, funciona por 15 minutos e desliga. Não consegue ligar em seguida; é necessário aguardar.",
  equipmentName: "Caixa amplificada",
  equipmentBrand: "JBJ",
  equipmentModel: "Cinema SB510",
  equipmentIdentifier: "VG0035-L90059985",
  clientNotes: "Sem acessórios. Cliente será avisado após a conclusão do serviço.",
  executionDescription: "Verificar alimentação e aquecimento do equipamento.",
  chargedAmount: "350.00",
  items: [
    { type: "SERVICE", totalPrice: "200.00" },
    { type: "PRODUCT", totalPrice: "150.00" },
  ],
  technician: { name: "Luiz" },
  client: {
    name: "Cliente de demonstração",
    document: "000.000.000-00",
    street: "Rua Exemplo",
    number: "39",
    district: "Centro",
    city: "Piracicaba",
    state: "SP",
    phone: "(19) 0000-0000",
  },
  company: {
    companyName: "ASSISTÊNCIA TÉCNICA - DEMONSTRAÇÃO",
    address: "Rua Exemplo, 1194 - Centro - Piracicaba/SP",
    cnpj: "00.000.000/0001-00",
    phone: "(19) 0000-0000",
    email: "contato@example.com",
    timezone: "America/Sao_Paulo",
  },
};
