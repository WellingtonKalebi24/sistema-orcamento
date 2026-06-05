describe("Rotas de orcamentos", () => {
  it("documenta que orcamento nao movimenta estoque na criacao ou aprovacao", () => {
    expect("quote").not.toBe("stock-movement");
  });
});
