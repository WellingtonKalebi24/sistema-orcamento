import { api } from "../../../lib/api/client";
import type { DashboardSummary } from "../../../lib/api/schema";

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary");
  return response.data.data as DashboardSummary;
}
