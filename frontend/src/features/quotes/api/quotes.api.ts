import { api } from "../../../lib/api/client";
import type { CatalogProduct, CatalogService, Quote, QuoteStatus } from "../../../lib/api/schema";

export type CatalogResponse = {
  products: CatalogProduct[];
  services: CatalogService[];
};

export async function listCatalog(search = "") {
  const response = await api.get("/catalog", { params: { search } });
  return response.data.data as CatalogResponse;
}

export async function listQuotes() {
  const response = await api.get("/quotes");
  return response.data.data.data as Quote[];
}

export async function getQuote(id: string) {
  const response = await api.get(`/quotes/${id}`);
  return response.data.data as Quote;
}

export async function createQuote(input: unknown) {
  const response = await api.post("/quotes", input);
  return response.data.data as Quote;
}

export async function changeQuoteStatus(id: string, status: QuoteStatus) {
  const response = await api.patch(`/quotes/${id}/status`, { status });
  return response.data.data as Quote;
}

export function quotePdfUrl(id: string) {
  return `${import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1"}/quotes/${id}/pdf`;
}
