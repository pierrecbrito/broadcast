import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box className="min-h-screen flex items-center justify-center p-6 bg-slate-50 ambient-bg relative overflow-hidden">
      <div className="ambient-glow" />
      <div className="ambient-glow-left" />

      <Card className="w-full max-w-md text-center p-8 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-premium relative z-10">
        <CardContent>
          <Typography
            variant="h2"
            component="h1"
            className="font-extrabold text-indigo-600 tracking-tight mb-2 text-6xl"
          >
            404
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            className="font-semibold text-slate-700 tracking-tight mb-6"
          >
            Pagina nao encontrada
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<HomeRoundedIcon />}
            className="shadow-sm font-semibold px-6 py-2.5"
          >
            Voltar para o inicio
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

