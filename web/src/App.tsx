import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import { theme } from "./theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Broadcast</h1>
        <p className="text-slate-600 mb-6">Plataforma de Disparo de Mensagens</p>
        <Button variant="contained" color="primary">
          Iniciar Sessao
        </Button>
      </main>
    </ThemeProvider>
  );
}
