import { api } from "@/services/api";
import type { ApiMessage, DashboardSummary } from "@/types";

export async function getDashboardSummary() {
  const { data } = await api.get<ApiMessage<DashboardSummary>>("/dashboard/summary");
  return data.data;
}
