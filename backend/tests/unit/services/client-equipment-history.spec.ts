import { summarizeEquipment } from "../../../src/services/client-equipment-history";

describe("Historico de equipamentos do cliente", () => {
  const visit = (id: string, status: string, identifier?: string) => ({ id, status, equipmentIdentifier: identifier, openedAt: new Date(), equipmentName: "Notebook" });
  it("agrupa a mesma identificacao e separa visitas de manutencoes concluidas", () => {
    const result = summarizeEquipment([visit("1", "CONCLUIDA", " abc "), visit("2", "CONCLUIDA", "ABC"), visit("3", "ABERTA", "abc"), visit("4", "CANCELADA", "ABC")]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ identifier: "ABC", visits: 3, completed: 2, orderIds: ["1", "2", "3", "4"] });
  });
  it("nao confunde aparelhos do mesmo modelo ou presume identidade de registros antigos", () => {
    const result = summarizeEquipment([visit("1", "CONCLUIDA", "A"), visit("2", "CONCLUIDA", "B"), visit("3", "CONCLUIDA"), visit("4", "CONCLUIDA", " ")]);
    expect(result).toHaveLength(2);
    expect(result.every((item) => item.completed === 1)).toBe(true);
  });
  it("nao limita o historico a vinte ordens", () => {
    expect(summarizeEquipment(Array.from({ length: 25 }, (_, index) => visit(String(index), "CONCLUIDA", "A")))[0].completed).toBe(25);
  });
});
