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
  category?: string;
  supplier?: string;
  unit: string;
  stockQuantity?: string;
  minimumStock?: string;
  salePrice: string;
  costPrice: string;
  lowStock?: boolean;
};

export type CatalogService = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  defaultPrice: string;
  estimatedMinutes?: number;
  status?: "ACTIVE" | "INACTIVE";
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

export type StockMovement = {
  id: string;
  productId: string;
  type: "ENTRY" | "EXIT" | "ADJUSTMENT" | "WORK_ORDER";
  quantity: string;
  previousBalance: string;
  newBalance: string;
  reason: string;
  createdAt: string;
  product?: CatalogProduct;
};

export type Payment = {
  id: string;
  quoteId?: string;
  workOrderId?: string;
  method: "DINHEIRO" | "PIX" | "CARTAO" | "BOLETO" | "TRANSFERENCIA";
  status: "PENDENTE" | "PARCIAL" | "PAGO" | "CANCELADO";
  amount: string;
  paidAmount: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  quote?: Quote;
  workOrder?: WorkOrder;
};

export type DashboardSummary = {
  cards: {
    quotesMonth: number;
    quotesApproved: number;
    quotesRejected: number;
    monthlyRevenue: string | null;
    estimatedProfit: string | null;
    openWorkOrders: number;
    inProgressServices: number;
    lowStock: number;
    clients: number;
  };
  revenueSeries: Array<{ month: string; revenue: number }>;
  quoteStatus: Array<{ status: QuoteStatus; total: number }>;
  topProducts: CatalogProduct[];
  latestQuotes: Quote[];
  latestWorkOrders: WorkOrder[];
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
