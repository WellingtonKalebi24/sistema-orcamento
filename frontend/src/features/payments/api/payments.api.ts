import { api } from "../../../lib/api/client";
import type { Payment } from "../../../lib/api/schema";

export async function listPayments() {
  const response = await api.get("/payments", { params: { pageSize: 50 } });
  return response.data.data.data as Payment[];
}

export async function createPayment(input: unknown) {
  const response = await api.post("/payments", input);
  return response.data.data as Payment;
}

export async function updatePayment(id: string, input: unknown) {
  const response = await api.patch(`/payments/${id}`, input);
  return response.data.data as Payment;
}
