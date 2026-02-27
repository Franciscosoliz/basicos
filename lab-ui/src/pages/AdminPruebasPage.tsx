import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControlLabel, Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type LabTest, listLabTestsApi, createLabTestApi, updateLabTestApi, deleteLabTestApi } from "../api/lab-tests.api";

export default function AdminPruebasPage() {
  const [items, setItems] = useState<LabTest[]>([]);
  const [test_name, setTestName] = useState("");
  const [sample_type, setSampleType] = useState("");
  const [price, setPrice] = useState("");
  const [is_available, setIsAvailable] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listLabTestsApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar pruebas.");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!test_name.trim()) return setError("Nombre de prueba requerido");
      if (!sample_type.trim()) return setError("Tipo de muestra requerido");
      const priceNum = parseFloat(price);
      if (Number.isNaN(priceNum) || priceNum < 0) return setError("Precio debe ser un número válido");

      const payload = { test_name: test_name.trim(), sample_type: sample_type.trim(), price: String(priceNum), is_available };
      if (editId) await updateLabTestApi(editId, payload);
      else await createLabTestApi(payload);

      setTestName("");
      setSampleType("");
      setPrice("");
      setIsAvailable(true);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar prueba.");
    }
  };

  const startEdit = (t: LabTest) => {
    setEditId(t.id);
    setTestName(t.test_name);
    setSampleType(t.sample_type);
    setPrice(t.price);
    setIsAvailable(t.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteLabTestApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar prueba.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Pruebas</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
          <TextField label="Nombre prueba" value={test_name} onChange={(e) => setTestName(e.target.value)} sx={{ minWidth: 180 }} />
          <TextField label="Tipo muestra" value={sample_type} onChange={(e) => setSampleType(e.target.value)} sx={{ minWidth: 140 }} />
          <TextField label="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ width: 100 }} inputProps={{ step: 0.01 }} />
          <FormControlLabel control={<Checkbox checked={is_available} onChange={(e) => setIsAvailable(e.target.checked)} />} label="Disponible" />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setTestName(""); setSampleType(""); setPrice(""); setIsAvailable(true); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prueba</TableCell>
              <TableCell>Tipo muestra</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.test_name}</TableCell>
                <TableCell>{t.sample_type}</TableCell>
                <TableCell>{t.price}</TableCell>
                <TableCell>{t.is_available ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(t)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(t.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
