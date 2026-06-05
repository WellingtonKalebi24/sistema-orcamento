export type UserRole = "ADMIN" | "ATENDENTE" | "TECNICO" | "FINANCEIRO";
export type QuoteStatus = "RASCUNHO" | "ENVIADO" | "APROVADO" | "RECUSADO" | "EXPIRADO";
export type ItemType = "SERVICE" | "PRODUCT";

export type ApiEnvelope<T> = {
  success: true;
  data: T;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
};

export type Client = {
  id: string;
  name: string;
  personType: "PF" | "PJ";
  document: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  salePrice: string;
  costPrice: string;
};

export type CatalogService = {
  id: string;
  name: string;
  defaultPrice: string;
};

export type Quote = {
  id: string;
  number: string;
  status: QuoteStatus;
  requestDescription: string;
  totalAmount: string;
  estimatedProfit: string;
  client?: Client;
  items?: Array<{
    id: string;
    descriptionSnapshot: string;
    quantity: string;
    unitPrice: string;
    total: string;
  }>;
};
