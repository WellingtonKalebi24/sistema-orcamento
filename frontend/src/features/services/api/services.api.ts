import { api } from "../../../lib/api/client";
import type { CatalogService } from "../../../lib/api/schema";

export async function listServices(search = "") {
  const response = await api.get("/services", { params: { search, pageSize: 50 } });
  return response.data.data.data as CatalogService[];
}

export async function createService(input: Partial<CatalogService>) {
  const response = await api.post("/services", input);
  return response.data.data as CatalogService;
}

export async function updateService(id: string, input: Partial<CatalogService>) {
  const response = await api.patch(`/services/${id}`, input);
  return response.data.data as CatalogService;
}

export async function deleteService(id: string) {
  const response = await api.delete(`/services/${id}`);
  return response.data.data as CatalogService;
}
