import { afterEach, describe, expect, it } from "vitest";
import { api } from "./client";

const originalAdapter = api.defaults.adapter;
afterEach(() => { api.defaults.adapter = originalAdapter; });

describe("Falhas de autenticacao", () => {
  it.each(["/auth/login", "/auth/refresh"])("nao renova sessao ao receber 401 em %s", async (url) => {
    const calls: string[] = [];
    api.defaults.adapter = async (config) => {
      calls.push(config.url!);
      // A segunda chamada responderia para evitar que uma regressao trave o teste.
      if (calls.length > 1) return { data: {}, status: 200, statusText: "OK", headers: {}, config };
      throw { config, response: { status: 401 } };
    };
    await expect(api.post(url)).rejects.toBeDefined();
    expect(calls).toEqual([url]);
  });

  it("tenta renovar apenas uma vez quando a sessao expirou", async () => {
    const calls: string[] = [];
    api.defaults.adapter = async (config) => {
      calls.push(config.url!);
      if (calls.length > 2) return { data: {}, status: 200, statusText: "OK", headers: {}, config };
      throw { config, response: { status: 401 } };
    };
    await expect(api.get("/clients")).rejects.toBeDefined();
    expect(calls).toEqual(["/clients", "/auth/refresh"]);
  });
});
