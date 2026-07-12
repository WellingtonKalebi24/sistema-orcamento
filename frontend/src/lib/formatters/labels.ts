import type { ItemType, QuoteStatus, UserRole, WorkOrderStatus } from "../api/schema";

type PaymentMethod = "DINHEIRO" | "PIX" | "CARTAO" | "BOLETO" | "TRANSFERENCIA";
type PaymentStatus = "PENDENTE" | "PARCIAL" | "PAGO" | "CANCELADO";
type StockMovementType = "ENTRY" | "EXIT" | "ADJUSTMENT" | "WORK_ORDER";
type RecordStatus = "ACTIVE" | "INACTIVE";
type AttachmentType = "WORK_ORDER_PHOTO" | "WORK_ORDER_DOCUMENT" | "CLIENT_ACCEPTANCE";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  ATENDENTE: "Atendente",
  TECNICO: "Tecnico",
  FINANCEIRO: "Financeiro",
};

export const recordStatusLabels: Record<RecordStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const quoteStatusLabels: Record<QuoteStatus, string> = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
  EXPIRADO: "Expirado",
};

export const workOrderStatusLabels: Record<WorkOrderStatus, string> = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em andamento",
  AGUARDANDO_PECA: "Aguardando peca",
  CONCLUIDA: "Concluida",
  CANCELADA: "Cancelada",
};

export const itemTypeLabels: Record<ItemType, string> = {
  SERVICE: "Servico",
  PRODUCT: "Produto/peca",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO: "Cartao",
  BOLETO: "Boleto",
  TRANSFERENCIA: "Transferencia",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDENTE: "Pendente",
  PARCIAL: "Parcial",
  PAGO: "Pago",
  CANCELADO: "Cancelado",
};

export const stockMovementTypeLabels: Record<StockMovementType, string> = {
  ENTRY: "Entrada",
  EXIT: "Saida",
  ADJUSTMENT: "Ajuste",
  WORK_ORDER: "Baixa por OS",
};

export const attachmentTypeLabels: Record<AttachmentType, string> = {
  WORK_ORDER_PHOTO: "Foto",
  WORK_ORDER_DOCUMENT: "Documento",
  CLIENT_ACCEPTANCE: "Aceite do cliente",
};
