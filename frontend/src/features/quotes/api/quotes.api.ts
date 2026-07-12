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

export async function updateQuote(id: string, input: unknown) {
  const response = await api.patch(`/quotes/${id}`, input);
  return response.data.data as Quote;
}

export async function changeQuoteStatus(id: string, status: QuoteStatus) {
  const response = await api.patch(`/quotes/${id}/status`, { status });
  return response.data.data as Quote;
}

export async function getQuotePdf(id: string) {
  const response = await api.get(`/quotes/${id}/pdf`, { responseType: "blob" });
  return response.data as Blob;
}

export async function downloadQuotePdf(id: string, number: string) {
  const blob = await getQuotePdf(id);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `orcamento-${number}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function printQuotePdf(id: string) {
  const printWindow = window.open("", "_blank");
  const blob = await getQuotePdf(id);
  const url = URL.createObjectURL(blob);

  if (!printWindow) {
    URL.revokeObjectURL(url);
    throw new Error("O navegador bloqueou a janela de impressao.");
  }

  printWindow.onload = () => printWindow.print();
  printWindow.location.href = url;
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
