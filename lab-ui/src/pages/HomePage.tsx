import { Container, Paper, Typography, Stack } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <ScienceIcon />
          <Typography variant="h5">Laboratorio — Gestión de Órdenes</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Consulta el estado de órdenes (público) o accede al panel admin para pruebas y órdenes.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Órdenes (estado) → Login → Admin → CRUD Pruebas / Órdenes.
        </Typography>
      </Paper>
    </Container>
  );
}
