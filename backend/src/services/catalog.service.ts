import { ProductRepository } from "../repositories/product.repository";
import { ServiceRepository } from "../repositories/service.repository";

export class CatalogService {
  constructor(
    private readonly products = new ProductRepository(),
    private readonly services = new ServiceRepository(),
  ) {}

  async list(search?: string) {
    const [products, services] = await Promise.all([
      this.products.listActive(search),
      this.services.listActive(search),
    ]);
    return { products, services };
  }
}
