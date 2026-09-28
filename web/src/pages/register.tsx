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

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError("Informe o e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Formato de e-mail invalido.");
      return;
    }

    if (password.length < 6) {
      setValidationError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("As senhas nao coincidem.");
      return;
    }

    try {
      setLoading(true);
      await signUp(trimmedEmail, password);
      navigate("/");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setValidationError("Este e-mail ja esta em uso por outra conta.");
      } else if (firebaseError.code === "auth/weak-password") {
        setValidationError("A senha informada e muito fraca.");
      } else {
        setValidationError(firebaseError.message || "Erro ao criar conta. Tente novamente.");
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
              Crie sua conta para acessar o painel
            </Typography>
          </Box>

          {validationError && (
            <Alert severity="error" className="mb-4">
              {validationError}
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
              label="Senha (minimo 6 caracteres)"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Criar Conta"}
            </Button>

            <Box className="text-center mt-4">
              <Typography variant="body2" className="text-slate-600">
                Ja possui uma conta?{" "}
                <Link component={RouterLink} to="/login" className="font-medium text-blue-600">
                  Fazer login
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
