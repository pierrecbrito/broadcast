import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Contact } from "../types/contact";
import { formatPhoneNumber, unformatPhoneNumber } from "../utils/phone";

type ContactDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => Promise<void>;
  initialData?: Contact | null;
};

export function ContactDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: ContactDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(formatPhoneNumber(initialData.phone));
    } else {
      setName("");
      setPhone("");
    }
    setError(null);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const phoneDigits = unformatPhoneNumber(phone);

    if (!trimmedName || trimmedName.length < 2) {
      setError("O nome do contato deve ter pelo menos 2 caracteres.");
      return;
    }

    if (!phoneDigits) {
      setError("O telefone do contato e obrigatorio.");
      return;
    }

    if (phoneDigits.length < 10) {
      setError("Informe um telefone valido no formato (11) 98765-4321 com DDD.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(trimmedName, formatPhoneNumber(phone));
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar contato.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.4)" },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="font-bold text-slate-900 tracking-tight text-xl pt-6 px-6 pb-2">
          {initialData ? "Editar Contato" : "Novo Contato"}
        </DialogTitle>
        <DialogContent className="px-6 py-2">
          {error && (
            <Alert severity="error" className="mb-4 mt-1 rounded-xl border border-red-200">
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="contact-name"
            label="Nome do Contato"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            placeholder="Ex: Maria Santos"
            className="mb-4 mt-2"
          />
          <TextField
            margin="dense"
            id="contact-phone"
            label="Telefone / Celular"
            type="text"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            disabled={submitting}
            placeholder="Ex: (11) 98765-4321"
            helperText="Formato: (DD) 9XXXX-XXXX"
          />
        </DialogContent>
        <DialogActions className="px-6 pb-6 pt-3 flex justify-end gap-2 border-t border-slate-100">
          <Button onClick={onClose} disabled={submitting} color="inherit" className="text-slate-600">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            className="shadow-sm font-semibold px-5"
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

