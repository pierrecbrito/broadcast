import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Connection } from "../types/connection";

type ConnectionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  initialData?: Connection | null;
};

export function ConnectionDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: ConnectionDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
    setError(null);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("O nome da conexao deve ter pelo menos 2 caracteres.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(trimmed);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar conexao.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Editar Conexao" : "Nova Conexao"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4 mt-1">
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="connection-name"
            label="Nome da Conexao"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            placeholder="Ex: WhatsApp Suporte"
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
