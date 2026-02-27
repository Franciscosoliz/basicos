import { http } from "./http";
import type { LabOrderEvent } from "../types/labOrderEvent";

export async function listLabOrderEventsApi(labOrderId?: number): Promise<LabOrderEvent[]> {
  const url = labOrderId != null ? `/api/lab-order-events/?lab_order_id=${labOrderId}` : "/api/lab-order-events/";
  const { data } = await http.get<LabOrderEvent[]>(url);
  return data;
}
