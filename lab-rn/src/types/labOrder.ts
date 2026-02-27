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
