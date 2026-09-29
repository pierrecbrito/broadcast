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
import Chip from "@mui/material/Chip";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
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
      <Box className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 xl:p-16 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-r border-slate-800/80">
        {/* Marca d'agua decorativa de ondas de transmissao no fundo do hero */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            right: -60,
            bottom: -60,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
            color: "rgba(129, 140, 248, 0.07)",
          }}
        >
          <svg
            width="440"
            height="440"
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
        <div className="absolute top-1/4 left-10 w-80 h-80 rounded-full bg-indigo-600/15 filter blur-3xl pointer-events-none" />

        {/* Topo do Hero: Marca e Badge */}
        <Box className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <SensorsRoundedIcon fontSize="medium" />
          </div>
          <Typography variant="h6" className="font-extrabold text-white tracking-tight text-xl">
            Broadcast
          </Typography>
          <Chip
            label="SaaS Console"
            size="small"
            className="text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          />
        </Box>

        {/* Meio do Hero: Mensagem de Impacto e Recursos */}
        <Box className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            Plataforma Inteligente de Mensageria
          </div>

          <Typography
            variant="h3"
            component="h2"
            className="font-extrabold text-white tracking-tight leading-tight mb-4 text-3xl xl:text-4xl"
          >
            Comunicação em escala com simplicidade e precisão.
          </Typography>

          <Typography variant="body1" className="text-slate-300 text-base leading-relaxed mb-8 font-normal">
            Gerencie canais de transmissão, organize seus contatos e dispare broadcasts instantâneos ou agendados com alta disponibilidade.
          </Typography>

          {/* Cards de destaques */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <SensorsRoundedIcon fontSize="small" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Multi-conexões centralizadas</span>
                <span className="text-[11px] text-slate-400">Organize canais dedicados para suporte, vendas e avisos.</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <PeopleAltRoundedIcon fontSize="small" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Gestão inteligente de destinatários</span>
                <span className="text-[11px] text-slate-400">Validação e formatação automática de números com DDD.</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <ScheduleRoundedIcon fontSize="small" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Agendamento pontual ou imediato</span>
                <span className="text-[11px] text-slate-400">Programação de disparos com transição automática.</span>
              </div>
            </div>
          </div>
        </Box>

        {/* Rodapé do Hero */}
        <Box className="relative z-10 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircleRoundedIcon sx={{ fontSize: 15 }} className="text-emerald-400" />
            <span>Infraestrutura em Nuvem Segura</span>
          </div>
          <span>v1.0 SaaS</span>
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


