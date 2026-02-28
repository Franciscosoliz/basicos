import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type LabTest, listLabTestsApi } from "../api/lab-tests.api";
import { type LabOrder, type LabOrderStatus, listLabOrdersAdminApi, createLabOrderApi, updateLabOrderApi, deleteLabOrderApi } from "../api/lab-orders.api";

const STATUS_OPTIONS: LabOrderStatus[] = ["CREATED", "PROCESSING", "COMPLETED", "CANCELLED"];

export default function AdminOrdenesPage() {
  const [items, setItems] = useState<LabOrder[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [test, setTest] = useState<number>(0);
  const [patient_name, setPatientName] = useState("");
  const [status, setStatus] = useState<LabOrderStatus>("CREATED");
  const [result_summary, setResultSummary] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listLabOrdersAdminApi();
      setItems(data.results);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      setError(typeof msg === "string" ? msg : "No se pudo cargar órdenes.");
    }
  };

  const loadTests = async () => {
    try {
      const data = await listLabTestsApi();
      setTests(data.results);
      if (!test && data.results.length > 0) setTest(data.results[0].id);
    } catch {}
  };

  useEffect(() => { load(); loadTests(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!test) return setError("Seleccione una prueba");
      if (!patient_name.trim()) return setError("Nombre del paciente requerido");

      const payload = { test: Number(test), patient_name: patient_name.trim(), status, result_summary: result_summary.trim() || null };

      if (editId) await updateLabOrderApi(editId, { patient_name: payload.patient_name, status: payload.status, result_summary: payload.result_summary });
      else await createLabOrderApi({ test: payload.test, patient_name: payload.patient_name, status: "CREATED" });

      setEditId(null);
      setPatientName("");
      setResultSummary("");
      setStatus("CREATED");
      await load();
    } catch (err: unknown) {
      const data = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: Record<string, unknown> } }).response?.data
        : null;
      let msg: string | null = null;
      if (data && typeof data === "object") {
        if ("detail" in data) {
          const d = data.detail;
          msg = typeof d === "string" ? d : Array.isArray(d) ? d.join(" ") : null;
        } else {
          msg = Object.entries(data)
            .flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map((s) => `${k}: ${s}`))
            .join(". ");
        }
      }
      setError(msg || "No se pudo guardar orden.");
    }
  };

  const startEdit = (o: LabOrder) => {
    setEditId(o.id);
    setTest(o.test);
    setPatientName(o.patient_name);
    setResultSummary(o.result_summary ?? "");
    setStatus(o.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteLabOrderApi(id);
      await load();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined;
      setError(typeof msg === "string" ? msg : "No se pudo eliminar orden.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Órdenes</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
              <InputLabel id="test-label">Prueba</InputLabel>
              <Select
                labelId="test-label"
                label="Prueba"
                value={test}
                onChange={(e) => setTest(Number(e.target.value))}
              >
                {tests.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.test_name} (#{t.id})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Paciente" value={patient_name} onChange={(e) => setPatientName(e.target.value)} sx={{ minWidth: 200 }} />
            <TextField label="Resumen resultado" value={result_summary} onChange={(e) => setResultSummary(e.target.value)} fullWidth placeholder="Opcional" />
            <FormControl sx={{ width: 160 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select labelId="status-label" label="Estado" value={status} onChange={(e) => setStatus(e.target.value as LabOrderStatus)}>
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setPatientName(""); setResultSummary(""); setStatus("CREATED"); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadTests(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prueba</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Resumen resultado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.test_name ?? o.test}</TableCell>
                <TableCell>{o.patient_name}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>{o.result_summary ?? "—"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(o)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(o.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
