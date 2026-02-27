import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { LabTest } from "../types/labTest";

export async function listLabTestsApi(): Promise<Paginated<LabTest>> {
  const { data } = await http.get<Paginated<LabTest>>("/api/lab-tests/");
  return data;
}
