import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type LabOrderStatus = "CREATED" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export type LabOrder = {
  id: number;
  test: number;
  test_name?: string;
  patient_name: string;
  status: LabOrderStatus;
  result_summary: string | null;
  created_at?: string;
};

export async function listLabOrdersPublicApi() {
  const { data } = await http.get<Paginated<LabOrder>>("/api/lab-orders/");
  return data;
}

export async function listLabOrdersAdminApi() {
  const { data } = await http.get<Paginated<LabOrder>>("/api/lab-orders/");
  return data;
}

export async function createLabOrderApi(payload: {
  test: number;
  patient_name: string;
  status?: LabOrderStatus;
  result_summary?: string | null;
  source?: string;
  note?: string;
}) {
  const { data } = await http.post<LabOrder>("/api/lab-orders/", payload);
  return data;
}

export async function updateLabOrderApi(id: number, payload: Partial<LabOrder>) {
  const { data } = await http.patch<LabOrder>(`/api/lab-orders/${id}/`, payload);
  return data;
}

export async function deleteLabOrderApi(id: number) {
  await http.delete(`/api/lab-orders/${id}/`);
}
