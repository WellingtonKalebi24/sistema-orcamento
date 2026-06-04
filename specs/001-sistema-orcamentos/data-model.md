# Modelo de Dados: Sistema de Orcamentos e Ordens de Servico

**ORM alvo**: Prisma  
**Banco alvo**: PostgreSQL  
**Convencoes**: IDs UUID em `String @id @default(uuid())`; datas em `DateTime`; moeda em `Decimal @db.Decimal(14, 2)`; quantidades em `Decimal @db.Decimal(14, 3)`.

## 1. Enums Prisma

| Enum | Valores |
|------|---------|
| `UserRole` | `ADMIN`, `ATENDENTE`, `TECNICO`, `FINANCEIRO` |
| `PersonType` | `PF`, `PJ` |
| `RecordStatus` | `ACTIVE`, `INACTIVE` |
| `QuoteStatus` | `RASCUNHO`, `ENVIADO`, `APROVADO`, `RECUSADO`, `EXPIRADO` |
| `ItemType` | `SERVICE`, `PRODUCT` |
| `WorkOrderStatus` | `ABERTA`, `EM_ANDAMENTO`, `AGUARDANDO_PECA`, `CONCLUIDA`, `CANCELADA` |
| `StockMovementType` | `ENTRY`, `EXIT`, `ADJUSTMENT`, `WORK_ORDER` |
| `PaymentMethod` | `DINHEIRO`, `PIX`, `CARTAO`, `BOLETO`, `TRANSFERENCIA` |
| `PaymentStatus` | `PENDENTE`, `PARCIAL`, `PAGO`, `CANCELADO` |
| `AttachmentType` | `COMPANY_LOGO`, `WORK_ORDER_PHOTO`, `WORK_ORDER_DOCUMENT`, `CLIENT_ACCEPTANCE` |
| `SequenceType` | `QUOTE`, `WORK_ORDER` |
| `AuditAction` | `CREATE`, `UPDATE`, `STATUS_CHANGE`, `LOGIN`, `ACCESS_DENIED`, `STOCK_CHANGE`, `PAYMENT_CHANGE`, `CONFIG_CHANGE` |

## 2. Modelos Principais

### User

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `name` | `String` | obrigatorio |
| `email` | `String` | unico, normalizado em minusculas |
| `passwordHash` | `String` | bcrypt, nunca retornado pela API |
| `role` | `UserRole` | obrigatorio |
| `status` | `RecordStatus` | `ACTIVE` por padrao |
| `lastLoginAt` | `DateTime?` | auditoria operacional |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |
| `deletedAt` | `DateTime?` | exclusao logica |

**Relacoes**: tecnico responsavel por `WorkOrder`; autor de movimentos, pagamentos, anexos e logs; dono de `RefreshToken`.

**Indices**: `@@index([role, status])`, unicidade em `email`.

### Client

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `name` | `String` | nome/razao social |
| `personType` | `PersonType` | PF/PJ |
| `document` | `String` | CPF/CNPJ somente digitos, unico entre ativos |
| `phone`, `whatsapp`, `email` | `String?` | contato |
| `street`, `number`, `complement`, `district`, `city`, `state`, `zipCode` | `String?` | endereco estruturado |
| `notes` | `String?` | observacoes |
| `status` | `RecordStatus` | ativo/inativo |
| `createdAt`, `updatedAt`, `deletedAt` | `DateTime` / `DateTime?` | auditoria/soft delete |

**Relacoes**: muitos `Quote` e `WorkOrder`.

**Indices**: `@@index([name])`, `@@index([status])`; indice unico parcial para documento ativo deve ser criado em migration SQL, pois o soft delete permite manter historico.

### Product

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `name`, `sku`, `category` | `String` | SKU unico |
| `supplier` | `String?` | fornecedor textual no MVP |
| `unit` | `String` | ex.: `UN`, `M`, `KG` |
| `stockQuantity` | `Decimal @db.Decimal(14,3)` | saldo corrente |
| `minimumStock` | `Decimal @db.Decimal(14,3)` | limite do alerta |
| `costPrice`, `salePrice` | `Decimal @db.Decimal(14,2)` | valores nao negativos |
| `status` | `RecordStatus` | ativo/inativo |
| `createdAt`, `updatedAt`, `deletedAt` | `DateTime` / `DateTime?` | auditoria/soft delete |

**Relacoes**: itens de orcamento, itens de OS e movimentos.

**Indices**: unicidade em `sku`; `@@index([status, category])`; indice para consulta de estoque baixo pode ser avaliado com a carga real.

### StockMovement

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `productId` | `String` | FK obrigatoria |
| `type` | `StockMovementType` | origem semantica |
| `quantity` | `Decimal @db.Decimal(14,3)` | sempre positiva; tipo define sinal |
| `previousBalance`, `newBalance` | `Decimal @db.Decimal(14,3)` | evidencia da alteracao |
| `reason` | `String` | obrigatorio em movimento manual |
| `workOrderItemId` | `String?` | origem da baixa automatica |
| `createdById` | `String` | usuario responsavel |
| `createdAt`, `updatedAt` | `DateTime` | historico imutavel funcionalmente |

**Relacoes**: um produto, usuario autor e item de OS opcional.

**Indices/constraints**: `@@index([productId, createdAt])`; `workOrderItemId @unique` quando preenchido, garantindo uma baixa automatica por item.

### Service

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `name`, `description`, `category` | `String` | catalogo |
| `defaultPrice` | `Decimal @db.Decimal(14,2)` | nao negativo |
| `estimatedMinutes` | `Int` | positivo |
| `status` | `RecordStatus` | ativo/inativo |
| `createdAt`, `updatedAt`, `deletedAt` | `DateTime` / `DateTime?` | auditoria/soft delete |

**Indices**: `@@index([status, category])`, `@@index([name])`.

### Quote

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `number` | `String` | unico, formato `ORC-AAAA-NNNNN` |
| `clientId` | `String` | FK obrigatoria |
| `issuedAt`, `validUntil` | `DateTime` | validade posterior a emissao |
| `requestDescription` | `String` | problema/solicitacao |
| `notes`, `paymentTerms`, `executionDeadline` | `String?` | termos |
| `laborAmount`, `travelFee`, `generalDiscount` | `Decimal @db.Decimal(14,2)` | nao negativos |
| `itemsSubtotal`, `totalDiscount`, `totalAmount`, `estimatedCost`, `estimatedProfit` | `Decimal @db.Decimal(14,2)` | calculados pelo service |
| `status` | `QuoteStatus` | ciclo da proposta |
| `clientSnapshot`, `companySnapshot` | `Json?` | congelados ao enviar |
| `snapshotAt` | `DateTime?` | instante de congelamento |
| `createdById`, `updatedById` | `String` | auditoria |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Relacoes**: cliente, muitos itens, no maximo uma OS, pagamentos opcionais.

**Indices**: unicidade em `number`; `@@index([status, issuedAt])`, `@@index([clientId, createdAt])`, `@@index([validUntil, status])`.

### QuoteItem

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id`, `quoteId` | `String` | PK/FK |
| `type` | `ItemType` | produto ou servico |
| `productId`, `serviceId` | `String?` | exatamente uma referencia segundo tipo |
| `descriptionSnapshot` | `String` | texto preservado |
| `unitSnapshot` | `String?` | aplicavel a produto |
| `quantity` | `Decimal @db.Decimal(14,3)` | maior que zero |
| `unitPrice`, `unitCost`, `discountAmount`, `subtotal`, `total` | `Decimal @db.Decimal(14,2)` | snapshot/calculos |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Constraints**: check SQL em migration exige `productId XOR serviceId`; `total = subtotal - discountAmount` e nunca negativo, validado tambem pelo service.

**Indice**: `@@index([quoteId, type])`.

### WorkOrder

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id`, `number` | `String` | PK UUID e numero unico `OS-AAAA-NNNNN` |
| `clientId` | `String` | FK |
| `quoteId` | `String? @unique` | nulo em OS manual; uma OS por orcamento |
| `technicianId` | `String?` | usuario TECNICO |
| `openedAt`, `expectedAt`, `completedAt` | `DateTime` / `DateTime?` | datas |
| `problemDescription` | `String` | solicitacao |
| `executionDescription`, `internalNotes`, `clientNotes` | `String?` | registro |
| `laborCost`, `chargedAmount`, `totalCost`, `estimatedProfit` | `Decimal @db.Decimal(14,2)` | valores apurados |
| `status` | `WorkOrderStatus` | ciclo operacional |
| `stockDeductedAt` | `DateTime?` | evidencia de baixa concluida |
| `createdById`, `updatedById` | `String` | autoria |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Relacoes**: cliente, orcamento opcional, tecnico, itens, pagamentos e anexos.

**Indices**: unicidade em `number` e `quoteId`; `@@index([status, openedAt])`, `@@index([technicianId, status])`, `@@index([clientId, createdAt])`.

### WorkOrderItem

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id`, `workOrderId` | `String` | PK/FK |
| `type` | `ItemType` | produto ou servico |
| `productId`, `serviceId` | `String?` | referencia opcional com snapshot |
| `descriptionSnapshot`, `unitSnapshot` | `String` / `String?` | historico |
| `plannedQuantity`, `usedQuantity` | `Decimal @db.Decimal(14,3)` | consumo real usado na baixa |
| `unitPrice`, `unitCost`, `totalPrice`, `totalCost` | `Decimal @db.Decimal(14,2)` | calculados |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Relacoes**: um movimento automatico opcional para item de produto concluido.

**Indices/constraints**: `@@index([workOrderId, type])`; XOR de referencia; `usedQuantity >= 0`.

### Payment

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `quoteId`, `workOrderId` | `String?` | exatamente um vinculo obrigatorio |
| `method` | `PaymentMethod` | forma |
| `status` | `PaymentStatus` | situacao |
| `amount`, `paidAmount` | `Decimal @db.Decimal(14,2)` | previsto/recebido |
| `dueDate`, `paidAt` | `DateTime?` | datas |
| `notes` | `String?` | observacoes |
| `createdById`, `updatedById` | `String` | autoria |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Indices/constraints**: check SQL `quoteId XOR workOrderId`; `@@index([status, dueDate])`, `@@index([workOrderId])`, `@@index([quoteId])`.

### CompanySettings

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | registro unico para empresa do MVP |
| `companyName`, `cnpj` | `String` | identificacao |
| `phone`, `whatsapp`, `email`, `address` | `String?` | contato |
| `pixKey`, `bankDetails` | `String?` | exibicao configuravel |
| `defaultQuoteText`, `defaultPdfFooter` | `String?` | documento |
| `logoAttachmentId` | `String?` | arquivo ativo |
| `allowNegativeStock` | `Boolean` | `false` por padrao |
| `timezone` | `String` | `America/Sao_Paulo` por padrao |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Auditoria**: toda alteracao de `allowNegativeStock` e configuracao sensivel produz `AuditLog`.

### Attachment

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `type` | `AttachmentType` | finalidade |
| `workOrderId` | `String?` | anexo operacional |
| `storageKey`, `originalName`, `mimeType` | `String` | localizacao/metadados |
| `sizeBytes` | `Int` | limite validado |
| `uploadedById` | `String` | autoria |
| `createdAt`, `updatedAt`, `deletedAt` | `DateTime` / `DateTime?` | soft delete |

**Indices**: `@@index([workOrderId, type])`.

## 3. Modelos Auxiliares

### RefreshToken

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id`, `userId` | `String` | PK/FK |
| `familyId` | `String` | agrupa rotacoes |
| `tokenHash` | `String @unique` | token nunca armazenado puro |
| `expiresAt`, `revokedAt`, `replacedAt` | `DateTime` / `DateTime?` | ciclo |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Indices**: `@@index([userId, expiresAt])`, `@@index([familyId])`.

### DocumentSequence

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `type` | `SequenceType` | tipo do documento |
| `year` | `Int` | ano |
| `lastValue` | `Int` | incrementado em transacao |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Constraint**: `@@unique([type, year])`.

### AuditLog

| Campo | Tipo Prisma | Regra |
|-------|-------------|-------|
| `id` | `String` | PK UUID |
| `actorId` | `String?` | usuario quando identificado |
| `action` | `AuditAction` | natureza |
| `entityType`, `entityId` | `String?` | alvo |
| `metadata` | `Json?` | valores nao sensiveis/antes-depois permitidos |
| `ipAddress`, `userAgent`, `requestId` | `String?` | rastreabilidade |
| `createdAt`, `updatedAt` | `DateTime` | timestamps |

**Indices**: `@@index([entityType, entityId, createdAt])`, `@@index([actorId, createdAt])`.

## 4. Relacionamentos

```text
Client 1 --- N Quote 1 --- N QuoteItem
Client 1 --- N WorkOrder 1 --- N WorkOrderItem
Quote 0..1 --- 1 WorkOrder
Product 1 --- N QuoteItem / WorkOrderItem / StockMovement
Service 1 --- N QuoteItem / WorkOrderItem
WorkOrderItem 0..1 --- 1 StockMovement (baixa automatica)
Quote ou WorkOrder 1 --- N Payment
WorkOrder 1 --- N Attachment
User 1 --- N RefreshToken / WorkOrder(tecnico) / AuditLog / operacoes
CompanySettings 0..1 --- 1 Attachment (logo)
```

## 5. Transicoes de Estado

### Orcamento

| Estado atual | Proximo estado permitido | Regra |
|--------------|--------------------------|-------|
| `RASCUNHO` | `ENVIADO` | possui cliente e ao menos um item; congela snapshots |
| `ENVIADO` | `APROVADO`, `RECUSADO`, `EXPIRADO` | aprovacao apenas dentro da validade ou com confirmacao administrativa registrada |
| `APROVADO` | nenhum fluxo comum | pode gerar uma unica OS |
| `RECUSADO` | nenhum | novo negocio exige novo orcamento |
| `EXPIRADO` | nenhum | novo envio exige duplicar/revisar proposta |

### Ordem de Servico

| Estado atual | Proximo estado permitido | Regra |
|--------------|--------------------------|-------|
| `ABERTA` | `EM_ANDAMENTO`, `AGUARDANDO_PECA`, `CANCELADA` | tecnico pode ser definido |
| `EM_ANDAMENTO` | `AGUARDANDO_PECA`, `CONCLUIDA`, `CANCELADA` | concluir valida itens/estoque |
| `AGUARDANDO_PECA` | `EM_ANDAMENTO`, `CANCELADA` | sem baixa |
| `CONCLUIDA` | nenhum | correcao somente por processo auditado |
| `CANCELADA` | nenhum | nao baixa estoque |

### Pagamento

| Estado atual | Proximo estado permitido |
|--------------|--------------------------|
| `PENDENTE` | `PARCIAL`, `PAGO`, `CANCELADO` |
| `PARCIAL` | `PARCIAL`, `PAGO`, `CANCELADO` |
| `PAGO` | `CANCELADO` apenas com motivo/auditoria de estorno |
| `CANCELADO` | nenhum |

## 6. Integridade e Transacoes Criticas

- Criacao de orcamento: numero sequencial e itens gravados atomicamente; nenhum movimento de estoque.
- Envio de orcamento: snapshots de cliente/empresa e status persistidos juntos.
- Conversao para OS: valida `APROVADO`, cria sequencia e OS/itens em transacao; `quoteId` unico bloqueia duplicacao.
- Conclusao de OS: transacao `Serializable` valida estado, saldo/configuracao, grava um `StockMovement` por item de produto, atualiza produtos, calcula custo/lucro, define `stockDeductedAt` e conclui a OS.
- Pagamentos: soma de valores pagos confirmados nao pode exceder o cobrado sem acao administrativa explicita de ajuste.

## 7. Soft Delete e Retencao

| Modelo | Exclusao logica | Motivo |
|--------|-----------------|--------|
| `User`, `Client`, `Product`, `Service`, `Attachment` | Sim | retirados da operacao sem apagar historico |
| `Quote`, `QuoteItem`, `WorkOrder`, `WorkOrderItem` | Nao | documentos operacionais mudam status |
| `Payment`, `StockMovement`, `AuditLog` | Nao | trilha financeira/estoque deve ser preservada |
| `CompanySettings`, `DocumentSequence`, `RefreshToken` | Nao | controle operacional/sessao |

## 8. Indices Minimos para Consultas do MVP

- Orcamentos: `(status, issuedAt)`, `(clientId, createdAt)`, `(validUntil, status)`.
- OS: `(status, openedAt)`, `(technicianId, status)`, `(clientId, createdAt)`.
- Produtos/movimentos: SKU unico e `(productId, createdAt)`.
- Pagamentos: `(status, dueDate)` e vinculos a OS/orcamento.
- Auditoria: `(entityType, entityId, createdAt)` e `(actorId, createdAt)`.

Indices adicionais devem ser introduzidos apenas apos observar planos de consulta e volume real do dashboard.
