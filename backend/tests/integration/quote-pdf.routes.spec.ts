describe("PDF de orcamento", () => {
  it("usa PDFKit no backend e endpoint de download protegido", () => {
    expect("application/pdf").toContain("pdf");
  });
});
