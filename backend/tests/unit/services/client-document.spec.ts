import { clientInputSchema } from "../../../src/validators/client.schemas";

describe("Documento do cliente", () => {
  it.each([
    ["123.456.789-09", "12345678909"],
    ["12.345.678/0001-90", "12345678000190"],
    ["01234567890", "01234567890"],
  ])("normaliza %s sem perder zeros iniciais", (document, expected) => {
    expect(clientInputSchema.parse({ name: "Cliente", personType: "PF", document }).document).toBe(
      expected,
    );
  });

  it.each(["", "123", "123456789012", "1234567890123", "123456789012345"])(
    "orienta em portugues quando o documento tem tamanho invalido: %s",
    (document) => {
      const result = clientInputSchema.safeParse({ name: "Cliente", personType: "PF", document });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Informe um CPF com 11 digitos ou um CNPJ com 14 digitos.",
        );
      }
    },
  );
});
