import { AppError } from "../utils/app-error";
import { decimal, money } from "../utils/money";

export type QuoteCalculationItem = {
  descriptionSnapshot: string;
  unitSnapshot?: string | null;
  quantity: string;
  unitPrice: string;
  unitCost: string;
  discountAmount: string;
  type: "SERVICE" | "PRODUCT";
  productId?: string | null;
  serviceId?: string | null;
};

export class QuoteCalculatorService {
  calculate(input: {
    items: QuoteCalculationItem[];
    laborAmount: string;
    travelFee: string;
    generalDiscount: string;
  }) {
    const items = input.items.map((item) => {
      const quantity = decimal(item.quantity);
      const unitPrice = money(item.unitPrice);
      const unitCost = money(item.unitCost);
      const discountAmount = money(item.discountAmount);
      const subtotal = money(quantity.mul(unitPrice));
      const total = money(subtotal.minus(discountAmount));
      if (total.isNegative())
        throw AppError.validation("Desconto do item nao pode gerar total negativo.");
      return {
        ...item,
        quantity: quantity.toFixed(3),
        unitPrice: unitPrice.toFixed(2),
        unitCost: unitCost.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
        costTotal: money(quantity.mul(unitCost)).toFixed(2),
      };
    });

    const itemsSubtotal = items.reduce((sum, item) => sum.plus(item.subtotal), decimal(0));
    const itemDiscount = items.reduce((sum, item) => sum.plus(item.discountAmount), decimal(0));
    const laborAmount = money(input.laborAmount);
    const travelFee = money(input.travelFee);
    const generalDiscount = money(input.generalDiscount);
    const estimatedCost = items.reduce((sum, item) => sum.plus(item.costTotal), decimal(0));
    const totalDiscount = money(itemDiscount.plus(generalDiscount));
    const totalAmount = money(itemsSubtotal.plus(laborAmount).plus(travelFee).minus(totalDiscount));
    if (totalAmount.isNegative())
      throw AppError.validation("Desconto geral nao pode gerar total negativo.");

    return {
      items,
      totals: {
        laborAmount: laborAmount.toFixed(2),
        travelFee: travelFee.toFixed(2),
        generalDiscount: generalDiscount.toFixed(2),
        itemsSubtotal: itemsSubtotal.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        estimatedCost: estimatedCost.toFixed(2),
        estimatedProfit: money(totalAmount.minus(estimatedCost)).toFixed(2),
      },
    };
  }
}
