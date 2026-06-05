-- Initial schema for Sistema de Orcamentos e Ordens de Servico.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ATENDENTE', 'TECNICO', 'FINANCEIRO');
CREATE TYPE "PersonType" AS ENUM ('PF', 'PJ');
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "QuoteStatus" AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'RECUSADO', 'EXPIRADO');
CREATE TYPE "ItemType" AS ENUM ('SERVICE', 'PRODUCT');
CREATE TYPE "WorkOrderStatus" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'AGUARDANDO_PECA', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE "StockMovementType" AS ENUM ('ENTRY', 'EXIT', 'ADJUSTMENT', 'WORK_ORDER');
CREATE TYPE "PaymentMethod" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO', 'BOLETO', 'TRANSFERENCIA');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'PARCIAL', 'PAGO', 'CANCELADO');
CREATE TYPE "AttachmentType" AS ENUM ('COMPANY_LOGO', 'WORK_ORDER_PHOTO', 'WORK_ORDER_DOCUMENT', 'CLIENT_ACCEPTANCE');
CREATE TYPE "SequenceType" AS ENUM ('QUOTE', 'WORK_ORDER');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'STATUS_CHANGE', 'LOGIN', 'ACCESS_DENIED', 'STOCK_CHANGE', 'PAYMENT_CHANGE', 'CONFIG_CHANGE');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);

CREATE TABLE "Client" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "personType" "PersonType" NOT NULL,
  "document" TEXT NOT NULL,
  "phone" TEXT,
  "whatsapp" TEXT,
  "email" TEXT,
  "street" TEXT,
  "number" TEXT,
  "complement" TEXT,
  "district" TEXT,
  "city" TEXT,
  "state" TEXT,
  "zipCode" TEXT,
  "notes" TEXT,
  "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);

CREATE UNIQUE INDEX "Client_document_active_key" ON "Client" ("document") WHERE "deletedAt" IS NULL;

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "sku" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL,
  "supplier" TEXT,
  "unit" TEXT NOT NULL,
  "stockQuantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "minimumStock" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "costPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "salePrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Product_non_negative_values" CHECK ("minimumStock" >= 0 AND "costPrice" >= 0 AND "salePrice" >= 0)
);

CREATE TABLE "Service" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "defaultPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "estimatedMinutes" INTEGER NOT NULL,
  "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Service_valid_values" CHECK ("defaultPrice" >= 0 AND "estimatedMinutes" > 0)
);

CREATE TABLE "Attachment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "type" "AttachmentType" NOT NULL,
  "workOrderId" TEXT,
  "storageKey" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "uploadedById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);

CREATE TABLE "CompanySettings" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "companyName" TEXT NOT NULL,
  "cnpj" TEXT NOT NULL,
  "phone" TEXT,
  "whatsapp" TEXT,
  "email" TEXT,
  "address" TEXT,
  "pixKey" TEXT,
  "bankDetails" TEXT,
  "defaultQuoteText" TEXT,
  "defaultPdfFooter" TEXT,
  "logoAttachmentId" TEXT UNIQUE REFERENCES "Attachment"("id"),
  "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
  "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Quote" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "number" TEXT NOT NULL UNIQUE,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "validUntil" TIMESTAMP(3) NOT NULL,
  "requestDescription" TEXT NOT NULL,
  "notes" TEXT,
  "paymentTerms" TEXT,
  "executionDeadline" TEXT,
  "laborAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "travelFee" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "generalDiscount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "itemsSubtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "totalDiscount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "totalAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "estimatedCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "estimatedProfit" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "status" "QuoteStatus" NOT NULL DEFAULT 'RASCUNHO',
  "clientSnapshot" JSONB,
  "companySnapshot" JSONB,
  "snapshotAt" TIMESTAMP(3),
  "createdById" TEXT NOT NULL REFERENCES "User"("id"),
  "updatedById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Quote_non_negative_values" CHECK ("laborAmount" >= 0 AND "travelFee" >= 0 AND "generalDiscount" >= 0 AND "totalAmount" >= 0)
);

CREATE TABLE "QuoteItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "quoteId" TEXT NOT NULL REFERENCES "Quote"("id") ON DELETE CASCADE,
  "type" "ItemType" NOT NULL,
  "productId" TEXT REFERENCES "Product"("id"),
  "serviceId" TEXT REFERENCES "Service"("id"),
  "descriptionSnapshot" TEXT NOT NULL,
  "unitSnapshot" TEXT,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unitPrice" DECIMAL(14,2) NOT NULL,
  "unitCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "discountAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "subtotal" DECIMAL(14,2) NOT NULL,
  "total" DECIMAL(14,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuoteItem_reference_xor" CHECK (("type" = 'PRODUCT' AND "productId" IS NOT NULL AND "serviceId" IS NULL) OR ("type" = 'SERVICE' AND "serviceId" IS NOT NULL AND "productId" IS NULL)),
  CONSTRAINT "QuoteItem_non_negative_values" CHECK ("quantity" > 0 AND "unitPrice" >= 0 AND "unitCost" >= 0 AND "discountAmount" >= 0 AND "total" >= 0)
);

CREATE TABLE "WorkOrder" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "number" TEXT NOT NULL UNIQUE,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "quoteId" TEXT UNIQUE REFERENCES "Quote"("id"),
  "technicianId" TEXT REFERENCES "User"("id"),
  "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expectedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "problemDescription" TEXT NOT NULL,
  "executionDescription" TEXT,
  "internalNotes" TEXT,
  "clientNotes" TEXT,
  "laborCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "chargedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "totalCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "estimatedProfit" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "status" "WorkOrderStatus" NOT NULL DEFAULT 'ABERTA',
  "stockDeductedAt" TIMESTAMP(3),
  "createdById" TEXT NOT NULL REFERENCES "User"("id"),
  "updatedById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id");

CREATE TABLE "WorkOrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "workOrderId" TEXT NOT NULL REFERENCES "WorkOrder"("id") ON DELETE CASCADE,
  "type" "ItemType" NOT NULL,
  "productId" TEXT REFERENCES "Product"("id"),
  "serviceId" TEXT REFERENCES "Service"("id"),
  "descriptionSnapshot" TEXT NOT NULL,
  "unitSnapshot" TEXT,
  "plannedQuantity" DECIMAL(14,3) NOT NULL,
  "usedQuantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "unitPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "unitCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "totalPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "totalCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkOrderItem_reference_xor" CHECK (("type" = 'PRODUCT' AND "productId" IS NOT NULL AND "serviceId" IS NULL) OR ("type" = 'SERVICE' AND "serviceId" IS NOT NULL AND "productId" IS NULL)),
  CONSTRAINT "WorkOrderItem_non_negative_values" CHECK ("plannedQuantity" > 0 AND "usedQuantity" >= 0)
);

CREATE TABLE "StockMovement" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "type" "StockMovementType" NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "previousBalance" DECIMAL(14,3) NOT NULL,
  "newBalance" DECIMAL(14,3) NOT NULL,
  "reason" TEXT NOT NULL,
  "workOrderItemId" TEXT UNIQUE REFERENCES "WorkOrderItem"("id"),
  "createdById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockMovement_positive_quantity" CHECK ("quantity" > 0)
);

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "quoteId" TEXT REFERENCES "Quote"("id"),
  "workOrderId" TEXT REFERENCES "WorkOrder"("id"),
  "method" "PaymentMethod" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
  "amount" DECIMAL(14,2) NOT NULL,
  "paidAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "dueDate" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdById" TEXT NOT NULL REFERENCES "User"("id"),
  "updatedById" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_reference_xor" CHECK (("quoteId" IS NOT NULL AND "workOrderId" IS NULL) OR ("quoteId" IS NULL AND "workOrderId" IS NOT NULL)),
  CONSTRAINT "Payment_non_negative_values" CHECK ("amount" >= 0 AND "paidAmount" >= 0)
);

CREATE TABLE "RefreshToken" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "familyId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "replacedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DocumentSequence" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "type" "SequenceType" NOT NULL,
  "year" INTEGER NOT NULL,
  "lastValue" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("type", "year")
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "actorId" TEXT REFERENCES "User"("id"),
  "action" "AuditAction" NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "requestId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "User_role_status_idx" ON "User" ("role", "status");
CREATE INDEX "Client_name_idx" ON "Client" ("name");
CREATE INDEX "Client_status_idx" ON "Client" ("status");
CREATE INDEX "Product_status_category_idx" ON "Product" ("status", "category");
CREATE INDEX "Service_status_category_idx" ON "Service" ("status", "category");
CREATE INDEX "Service_name_idx" ON "Service" ("name");
CREATE INDEX "Quote_status_issuedAt_idx" ON "Quote" ("status", "issuedAt");
CREATE INDEX "Quote_clientId_createdAt_idx" ON "Quote" ("clientId", "createdAt");
CREATE INDEX "Quote_validUntil_status_idx" ON "Quote" ("validUntil", "status");
CREATE INDEX "QuoteItem_quoteId_type_idx" ON "QuoteItem" ("quoteId", "type");
CREATE INDEX "WorkOrder_status_openedAt_idx" ON "WorkOrder" ("status", "openedAt");
CREATE INDEX "WorkOrder_technicianId_status_idx" ON "WorkOrder" ("technicianId", "status");
CREATE INDEX "WorkOrder_clientId_createdAt_idx" ON "WorkOrder" ("clientId", "createdAt");
CREATE INDEX "WorkOrderItem_workOrderId_type_idx" ON "WorkOrderItem" ("workOrderId", "type");
CREATE INDEX "StockMovement_productId_createdAt_idx" ON "StockMovement" ("productId", "createdAt");
CREATE INDEX "Payment_status_dueDate_idx" ON "Payment" ("status", "dueDate");
CREATE INDEX "Payment_workOrderId_idx" ON "Payment" ("workOrderId");
CREATE INDEX "Payment_quoteId_idx" ON "Payment" ("quoteId");
CREATE INDEX "Attachment_workOrderId_type_idx" ON "Attachment" ("workOrderId", "type");
CREATE INDEX "RefreshToken_userId_expiresAt_idx" ON "RefreshToken" ("userId", "expiresAt");
CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken" ("familyId");
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog" ("entityType", "entityId", "createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog" ("actorId", "createdAt");
