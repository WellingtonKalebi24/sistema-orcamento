import { api } from "../../../lib/api/client";
import type { CatalogProduct, StockMovement } from "../../../lib/api/schema";

export async function listProducts(search = "", lowStock = false) {
  const response = await api.get("/products", { params: { search, lowStock, pageSize: 50 } });
  return response.data.data.data as CatalogProduct[];
}

export async function createProduct(input: Partial<CatalogProduct>) {
  const response = await api.post("/products", input);
  return response.data.data as CatalogProduct;
}

export async function updateProduct(id: string, input: Partial<CatalogProduct>) {
  const response = await api.patch(`/products/${id}`, input);
  return response.data.data as CatalogProduct;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`);
  return response.data.data as CatalogProduct;
}

export async function listStockMovements(productId?: string) {
  const response = await api.get("/stock-movements", { params: { productId, pageSize: 50 } });
  return response.data.data.data as StockMovement[];
}

export async function createStockMovement(productId: string, input: unknown) {
  const response = await api.post(`/products/${productId}/stock-movements`, input);
  return response.data.data as StockMovement;
}
