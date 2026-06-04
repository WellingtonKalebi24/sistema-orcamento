import request from "supertest";

import { testApp } from "../helpers/test-app";

describe("GET /health", () => {
  it("informa que a API esta operacional", async () => {
    const response = await request(testApp).get("/health").expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        service: "sistema-orcamento-api",
        status: "ok",
        timestamp: expect.any(String),
      },
    });
  });
});
