import { http } from "./http";
import type { TestCatalogItem } from "../types/testCatalog";

export async function listTestCatalogApi(): Promise<TestCatalogItem[]> {
  const { data } = await http.get<TestCatalogItem[]>("/api/test-catalog/");
  return data;
}
