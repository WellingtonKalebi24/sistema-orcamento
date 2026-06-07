export type UserRole = "ADMIN" | "ATENDENTE" | "TECNICO" | "FINANCEIRO";
export type QuoteStatus = "RASCUNHO" | "ENVIADO" | "APROVADO" | "RECUSADO" | "EXPIRADO";
export type WorkOrderStatus =
  | "ABERTA"
  | "EM_ANDAMENTO"
  | "AGUARDANDO_PECA"
  | "CONCLUIDA"
  | "CANCELADA";
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
  clientId: string;
  status: QuoteStatus;
  requestDescription: string;
  notes?: string;
  totalAmount: string;
  estimatedCost: string;
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

export type WorkOrderItem = {
  id: string;
  type: ItemType;
  productId?: string;
  serviceId?: string;
  descriptionSnapshot: string;
  plannedQuantity: string;
  usedQuantity: string;
  unitPrice: string;
  totalPrice: string;
  totalCost: string;
};

export type Attachment = {
  id: string;
  type: "WORK_ORDER_PHOTO" | "WORK_ORDER_DOCUMENT" | "CLIENT_ACCEPTANCE";
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export type WorkOrder = {
  id: string;
  number: string;
  clientId: string;
  quoteId?: string;
  technicianId?: string;
  openedAt: string;
  expectedAt?: string;
  completedAt?: string;
  problemDescription: string;
  executionDescription?: string;
  internalNotes?: string;
  clientNotes?: string;
  chargedAmount: string;
  totalCost: string;
  estimatedProfit: string;
  status: WorkOrderStatus;
  client?: Client;
  items?: WorkOrderItem[];
  attachments?: Attachment[];
};
