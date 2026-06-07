import { api } from "../../../lib/api/client";

export async function getReports() {
  const response = await api.get("/reports");
  return response.data.data as {
    quotes: unknown[];
    workOrders: unknown[];
    payments: unknown[];
    stock: Array<{ id: string; name: string; lowStock: boolean; stockQuantity: string }>;
  };
}
