import { api } from "../../../lib/api/client";
import type { Client } from "../../../lib/api/schema";

export async function createClient(input: Partial<Client>) {
  const response = await api.post("/clients", input);
  return response.data.data as Client;
}

export async function listClients(search = "") {
  const response = await api.get("/clients", { params: { search, pageSize: 20 } });
  return response.data.data.data as Client[];
}
