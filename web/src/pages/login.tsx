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
    <Box className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border border-slate-200">
        <CardContent className="p-8">
          <Box className="text-center mb-6">
            <Typography variant="h4" component="h1" className="font-bold text-slate-800">
              Broadcast
            </Typography>
            <Typography variant="body2" className="text-slate-500 mt-1">
              Acesse sua conta para gerenciar suas conexoes
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" className="mb-4">
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              className="mt-4 mb-3 py-3 font-semibold"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>

            <Box className="text-center mt-4">
              <Typography variant="body2" className="text-slate-600">
                Nao possui uma conta?{" "}
                <Link component={RouterLink} to="/register" className="font-medium text-blue-600">
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
