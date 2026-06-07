import { StockService } from "./stock.service";
import { WorkOrderRepository } from "../repositories/work-order.repository";
import { AppError } from "../utils/app-error";
import type { WorkOrderCompletionInput } from "../validators/work-order.schemas";

export class WorkOrderCompletionService {
  constructor(
    private readonly workOrders = new WorkOrderRepository(),
    private readonly stock = new StockService(),
  ) {}

  async complete(id: string, input: WorkOrderCompletionInput, userId: string) {
    const workOrder = await this.workOrders.findById(id);
    if (!workOrder) throw AppError.notFound("Ordem de servico nao encontrada.");
    if (workOrder.status === "CONCLUIDA" || workOrder.stockDeductedAt) {
      throw AppError.conflict("Ordem de servico ja foi concluida.");
    }
    if (workOrder.status === "CANCELADA") {
      throw AppError.conflict("Ordem de servico cancelada nao pode ser concluida.");
    }

    await this.stock.deductWorkOrderItems(workOrder.items, userId);

    return this.workOrders.update(id, {
      status: "CONCLUIDA",
      completedAt: new Date(),
      stockDeductedAt: new Date(),
      executionDescription: input.executionDescription,
      clientNotes: input.clientNotes,
      internalNotes: input.internalNotes,
      updatedById: userId,
    });
  }
}
