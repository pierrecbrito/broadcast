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
    <Box className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* PAINEL HERO (LADO ESQUERDO) */}
      <Box className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-12 xl:p-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden border-r border-slate-800/60">
        {/* Marca d'agua decorativa de ondas de transmissao no fundo do hero */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            right: -50,
            bottom: -50,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
            color: "rgba(129, 140, 248, 0.06)",
          }}
        >
          <svg
            width="460"
            height="460"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <path d="M 38 38 A 17 17 0 0 0 38 62" />
            <path d="M 62 38 A 17 17 0 0 1 62 62" />
            <path d="M 28 28 A 31 31 0 0 0 28 72" />
            <path d="M 72 28 A 31 31 0 0 1 72 72" />
            <path d="M 18 18 A 45 45 0 0 0 18 82" />
            <path d="M 82 18 A 45 45 0 0 1 82 82" />
            <path d="M 8 8 A 59 59 0 0 0 8 92" />
            <path d="M 92 8 A 59 59 0 0 1 92 92" />
          </svg>
        </Box>

        {/* Efeito de luz ambiente difusa */}
        <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-indigo-600/10 filter blur-3xl pointer-events-none" />

        {/* Topo do Hero: Apenas a Marca */}
        <Box className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <SensorsRoundedIcon fontSize="medium" />
          </div>
          <Typography variant="h6" className="font-extrabold text-white tracking-tight text-xl">
            Broadcast
          </Typography>
        </Box>

        {/* Meio do Hero: Mensagem Simples e Direta */}
        <Box className="relative z-10 my-auto py-12 max-w-lg">
          <Typography
            variant="h2"
            component="h2"
            className="font-extrabold text-white tracking-tight leading-tight mb-4 text-3xl sm:text-4xl xl:text-5xl"
          >
            Comunicação em escala.
          </Typography>

          <Typography variant="body1" className="text-slate-400 text-lg font-normal leading-relaxed">
            Transmissões rápidas, elegantes e sem atritos.
          </Typography>
        </Box>

        {/* Rodapé discreto */}
        <Box className="relative z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Broadcast
        </Box>
      </Box>

      {/* PAINEL DE FORMULARIO (LADO DIREITO) */}
      <Box className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-50/60 ambient-bg relative">
        <div className="ambient-glow" />

        <div className="w-full max-w-md mx-auto relative z-10">
          {/* Logo exibido apenas no Mobile quando o Hero estiver oculto */}
          <Box className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <SensorsRoundedIcon fontSize="small" />
            </div>
            <Typography variant="h6" className="font-extrabold text-slate-900 tracking-tight text-xl">
              Broadcast
            </Typography>
          </Box>

          <Card className="w-full shadow-premium border border-slate-200/90 rounded-3xl bg-white/95 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8 sm:p-10">
              <Box className="mb-8">
                <Typography variant="h4" component="h1" className="font-extrabold text-slate-900 tracking-tight text-2xl sm:text-3xl mb-1.5">
                  Broadcast
                </Typography>
                <Typography variant="body2" className="text-slate-500 font-normal">
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
        </div>
      </Box>
    </Box>
  );
}


