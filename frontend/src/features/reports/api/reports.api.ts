import { api } from "../../../lib/api/client";
import type { Payment, Quote, WorkOrder } from "../../../lib/api/schema";

export async function getReports() {
  const response = await api.get("/reports");
  return response.data.data as {
    quotes: Quote[];
    workOrders: WorkOrder[];
    payments: Payment[];
    stock: Array<{
      id: string;
      name: string;
      lowStock: boolean;
      stockQuantity: string;
      minimumStock: string;
    }>;
  };
}
