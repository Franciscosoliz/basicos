import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { LabOrder, LabOrderStatus } from "../types/labOrder";

export async function listLabOrdersApi(): Promise<Paginated<LabOrder>> {
  const { data } = await http.get<Paginated<LabOrder>>("/api/lab-orders/");
  return data;
}

export async function createLabOrderApi(payload: {
  test: number;
  patient_name: string;
  status?: string;
  source?: string;
  note?: string;
}): Promise<LabOrder> {
  const body = { ...payload, status: payload.status ?? "CREATED" };
  const { data } = await http.post<LabOrder>("/api/lab-orders/", body);
  return data;
}

export async function updateLabOrderApi(id: number, payload: Partial<{ status: LabOrderStatus; result_summary: string | null }>): Promise<LabOrder> {
  const { data } = await http.patch<LabOrder>(`/api/lab-orders/${id}/`, payload);
  return data;
}
