import type { UserRole } from "../lib/api/schema";

export const permissions: Record<string, UserRole[]> = {
  dashboard: ["ADMIN", "ATENDENTE", "TECNICO", "FINANCEIRO"],
  clients: ["ADMIN", "ATENDENTE"],
  quotes: ["ADMIN", "ATENDENTE", "FINANCEIRO"],
  services: ["ADMIN", "ATENDENTE"],
  products: ["ADMIN", "FINANCEIRO"],
  stock: ["ADMIN", "FINANCEIRO"],
  workOrders: ["ADMIN", "ATENDENTE", "TECNICO"],
  payments: ["ADMIN", "FINANCEIRO"],
  reports: ["ADMIN", "FINANCEIRO"],
};

export function canAccess(role: UserRole | undefined, resource: keyof typeof permissions) {
  return Boolean(role && permissions[resource].includes(role));
}
