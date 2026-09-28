import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-extrabold text-slate-800 mb-2">404</h1>
      <p className="text-xl text-slate-600 mb-6">Pagina nao encontrada</p>
      <Button component={Link} to="/" variant="contained" color="primary">
        Voltar para o inicio
      </Button>
    </div>
  );
}
