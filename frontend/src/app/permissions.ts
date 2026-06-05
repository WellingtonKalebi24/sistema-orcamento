import type { UserRole } from "../lib/api/schema";

export const permissions: Record<string, UserRole[]> = {
  dashboard: ["ADMIN", "ATENDENTE", "TECNICO", "FINANCEIRO"],
  clients: ["ADMIN", "ATENDENTE"],
  quotes: ["ADMIN", "ATENDENTE", "FINANCEIRO"],
};

export function canAccess(role: UserRole | undefined, resource: keyof typeof permissions) {
  return Boolean(role && permissions[resource].includes(role));
}
