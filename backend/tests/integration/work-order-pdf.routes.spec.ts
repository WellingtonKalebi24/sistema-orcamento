import express from "express";
import request from "supertest";

import { workOrderRouter } from "../../src/routes/work-order.routes";
import { TokenProvider } from "../../src/providers/auth/token.provider";
import { UserRepository } from "../../src/repositories/user.repository";
import { WorkOrderPdfService } from "../../src/services/work-order-pdf.service";
import { AppError } from "../../src/utils/app-error";

const app = express();
app.use("/work-orders", workOrderRouter);
app.use(
  (error: AppError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    void _next;
    res.status(error.statusCode ?? 500).json({ message: error.message });
  },
);

afterEach(() => jest.restoreAllMocks());

it("exige autenticação para baixar a OS", async () => {
  const generate = jest.spyOn(WorkOrderPdfService.prototype, "generate");
  await request(app).get("/work-orders/123/pdf").expect(401);
  expect(generate).not.toHaveBeenCalled();
});

it("entrega PDF com cabeçalhos de download ao usuário autenticado", async () => {
  jest
    .spyOn(TokenProvider.prototype, "verifyAccessToken")
    .mockResolvedValue({ sub: "user", email: "user@example.com", role: "ADMIN" });
  jest
    .spyOn(UserRepository.prototype, "findActiveById")
    .mockResolvedValue({ id: "user", email: "user@example.com", role: "ADMIN" } as never);
  jest
    .spyOn(WorkOrderPdfService.prototype, "generate")
    .mockResolvedValue({ fileName: "ordem-servico-OS-1.pdf", buffer: Buffer.from("%PDF-1.3") });
  const response = await request(app)
    .get("/work-orders/123/pdf")
    .set("Authorization", "Bearer test")
    .expect(200);
  expect(response.headers["content-type"]).toContain("application/pdf");
  expect(response.headers["content-disposition"]).toBe(
    'attachment; filename="ordem-servico-OS-1.pdf"',
  );
  expect(response.body.toString()).toBe("%PDF-1.3");
});
