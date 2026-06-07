import { api } from "../../../lib/api/client";
import type { Attachment, WorkOrder } from "../../../lib/api/schema";

export async function listWorkOrders() {
  const response = await api.get("/work-orders");
  return response.data.data.data as WorkOrder[];
}

export async function getWorkOrder(id: string) {
  const response = await api.get(`/work-orders/${id}`);
  return response.data.data as WorkOrder;
}

export async function createWorkOrder(input: unknown) {
  const response = await api.post("/work-orders", input);
  return response.data.data as WorkOrder;
}

export async function updateWorkOrder(id: string, input: unknown) {
  const response = await api.patch(`/work-orders/${id}`, input);
  return response.data.data as WorkOrder;
}

export async function completeWorkOrder(id: string, input: unknown) {
  const response = await api.post(`/work-orders/${id}/complete`, input);
  return response.data.data as WorkOrder;
}

export async function convertQuoteToWorkOrder(quoteId: string, input: unknown = {}) {
  const response = await api.post(`/quotes/${quoteId}/work-order`, input);
  return response.data.data as WorkOrder;
}

export async function listAttachments(workOrderId: string) {
  const response = await api.get(`/work-orders/${workOrderId}/attachments`);
  return response.data.data as Attachment[];
}

export async function uploadAttachment(workOrderId: string, file: File, type: Attachment["type"]) {
  const data = new FormData();
  data.append("file", file);
  data.append("type", type);
  const response = await api.post(`/work-orders/${workOrderId}/attachments`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data as Attachment;
}

export function attachmentDownloadUrl(id: string) {
  return `${import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1"}/work-orders/attachments/${id}/download`;
}
