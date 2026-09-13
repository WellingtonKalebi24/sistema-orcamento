import { api } from "../../../lib/api/client";
import type { Client, Quote, WorkOrder } from "../../../lib/api/schema";

export type ClientHistory = Client & {
  quotes: Quote[]; workOrders: WorkOrder[];
  equipmentHistory: Array<{ identifier: string; name: string; brand: string; model: string; visits: number; completed: number; orderIds: string[] }>;
};

export async function createClient(input: Partial<Client>) {
  const response = await api.post("/clients", input);
  return response.data.data as Client;
}

export async function updateClient(id: string, input: Partial<Client>) {
  const response = await api.patch(`/clients/${id}`, input);
  return response.data.data as Client;
}

export async function listClients(search = "") {
  const response = await api.get("/clients", { params: { search, pageSize: 20 } });
  return response.data.data.data as Client[];
}

export async function getClient(id: string) {
  const response = await api.get(`/clients/${id}`);
  return response.data.data as Client;
}

export async function getClientHistory(id: string) {
  const response = await api.get(`/clients/${id}/history`);
  return response.data.data as ClientHistory;
}

export async function deleteClient(id: string) {
  const response = await api.delete(`/clients/${id}`);
  return response.data.data as Client;
}
