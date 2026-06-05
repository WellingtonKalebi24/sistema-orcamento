import { QuotePdfProvider } from "../providers/pdf/quote-pdf.provider";
import { QuoteService } from "./quote.service";

export class QuotePdfService {
  constructor(
    private readonly quotes = new QuoteService(),
    private readonly pdf = new QuotePdfProvider(),
  ) {}

  async generate(id: string) {
    const quote = await this.quotes.findById(id);
    return {
      fileName: `orcamento-${quote.number}.pdf`,
      buffer: await this.pdf.generate(quote),
    };
  }
}
