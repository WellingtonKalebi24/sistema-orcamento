import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ClientForm } from "./ClientForm";

describe("ClientForm", () => {
  it("bloqueia documento incompleto antes de chamar a API", () => {
    const onSubmit = vi.fn();
    render(<ClientForm client={{ name: "Cliente", document: "123" }} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Salvar cliente" }));
    expect(
      screen.getByText("Informe um CPF com 11 digitos ou um CNPJ com 14 digitos."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envia documento com mascara normalizado", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ClientForm client={{ name: "Cliente", document: "012.345.678-90" }} onSubmit={onSubmit} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Salvar cliente" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ document: "01234567890" })),
    );
    expect(await screen.findByText("Cliente salvo com sucesso.")).toBeInTheDocument();
  });
});
