import { ProductRepository } from "../repositories/product.repository";
import { AppError } from "../utils/app-error";
import type { ProductInput, ProductUpdateInput } from "../validators/product.schemas";

type ProductLike = { stockQuantity: unknown; minimumStock: unknown };

function isLowStock(product: ProductLike) {
  return Number(product.stockQuantity) <= Number(product.minimumStock);
}

export class ProductService {
  constructor(private readonly products = new ProductRepository()) {}

  async list(filters: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    lowStock?: boolean;
  }) {
    const [data, total] = await this.products.list(filters);
    const enriched = data.map((product: ProductLike) => ({
      ...product,
      lowStock: isLowStock(product),
    }));
    const filtered = filters.lowStock
      ? enriched.filter((product: ProductLike & { lowStock: boolean }) => product.lowStock)
      : enriched;
    return {
      data: filtered,
      meta: { ...filters, total: filters.lowStock ? filtered.length : total },
    };
  }

  async lowStock() {
    const [data] = await this.products.list({ page: 1, pageSize: 100, status: "ACTIVE" });
    return data.filter((product: ProductLike) => isLowStock(product));
  }

  async findById(id: string) {
    const product = await this.products.findById(id);
    if (!product) throw AppError.notFound("Produto nao encontrado.");
    return product;
  }

  create(input: ProductInput) {
    return this.products.create(input);
  }

  async update(id: string, input: ProductUpdateInput) {
    await this.findById(id);
    return this.products.update(id, input);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.products.softDelete(id);
  }
}
