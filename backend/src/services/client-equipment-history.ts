type Visit = {
  id: string;
  status: string;
  openedAt: Date | string;
  equipmentIdentifier?: string | null;
  equipmentName?: string | null;
  equipmentBrand?: string | null;
  equipmentModel?: string | null;
};

export function summarizeEquipment(orders: Visit[]) {
  const groups = new Map<string, { identifier: string; name: string; brand: string; model: string; visits: number; completed: number; orderIds: string[] }>();
  const chronological = [...orders].sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
  for (const order of chronological) {
    const identifier = order.equipmentIdentifier?.trim().toUpperCase();
    if (!identifier) continue;
    const group = groups.get(identifier) ?? { identifier, name: "", brand: "", model: "", visits: 0, completed: 0, orderIds: [] };
    group.name = order.equipmentName || group.name;
    group.brand = order.equipmentBrand || group.brand;
    group.model = order.equipmentModel || group.model;
    group.orderIds.push(order.id);
    if (order.status !== "CANCELADA") group.visits += 1;
    if (order.status === "CONCLUIDA") group.completed += 1;
    groups.set(identifier, group);
  }
  return [...groups.values()];
}
