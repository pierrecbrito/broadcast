import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useAuth } from "../hooks/use-auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Informe o e-mail.");
      return;
    }

    if (!password) {
      setErrorMessage("Informe a senha.");
      return;
    }

    try {
      setLoading(true);
      await signIn(trimmedEmail, password);
      navigate("/");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setErrorMessage("E-mail ou senha invalidos.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setErrorMessage("Muitas tentativas sem sucesso. Tente novamente mais tarde.");
      } else {
        setErrorMessage(firebaseError.message || "Erro ao autenticar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 ambient-bg relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow" />
      <div className="ambient-glow-left" />

      <Card className="w-full max-w-md shadow-premium border border-slate-200/90 rounded-3xl bg-white/95 backdrop-blur-md relative z-10 overflow-hidden">
        <CardContent className="p-8 sm:p-10">
          <Box className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 mx-auto mb-4">
              <SensorsRoundedIcon fontSize="medium" />
            </div>
            <Typography variant="h4" component="h1" className="font-extrabold text-slate-900 tracking-tight">
              Broadcast
            </Typography>
            <Typography variant="body2" className="text-slate-500 mt-1.5 font-normal">
              Acesse sua conta para gerenciar suas conexoes
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" className="mb-6 rounded-xl border border-red-200">
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="mb-3"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="mb-4"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForwardRoundedIcon fontSize="small" />}
              className="mt-2 mb-4 py-3 font-semibold shadow-md"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>

            <Box className="text-center mt-6 pt-4 border-t border-slate-100">
              <Typography variant="body2" className="text-slate-500">
                Nao possui uma conta?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
                >
                  Cadastre-se
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

