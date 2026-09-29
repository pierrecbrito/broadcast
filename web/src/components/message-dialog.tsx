import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Contact } from "../types/contact";
import { Message, CreateMessageInput } from "../types/message";
import { formatPhoneNumber } from "../utils/phone";

type MessageDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateMessageInput) => Promise<void>;
  contacts: Contact[];
  initialData?: Message | null;
};

// Formata uma data para o valor do input datetime-local no fuso horario local
function formatDateToInput(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function MessageDialog({
  open,
  onClose,
  onSubmit,
  contacts,
  initialData,
}: MessageDialogProps) {
  const isEditing = Boolean(initialData);

  const [body, setBody] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [sendMode, setSendMode] = useState<"now" | "schedule">("now");
  const [scheduledAtStr, setScheduledAtStr] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setBody(initialData.body);
      setSelectedContactIds(initialData.contactIds || []);
      setSendMode("schedule");
      if (initialData.scheduledAt) {
        setScheduledAtStr(formatDateToInput(initialData.scheduledAt));
      } else {
        // Padrao 1 hora a frente
        const nextHour = new Date(Date.now() + 60 * 60 * 1000);
        setScheduledAtStr(formatDateToInput(nextHour));
      }
    } else {
      setBody("");
      setSelectedContactIds([]);
      setSendMode("now");
      const nextHour = new Date(Date.now() + 60 * 60 * 1000);
      setScheduledAtStr(formatDateToInput(nextHour));
    }
    setError(null);
  }, [initialData, open]);

  const handleToggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContactIds(contacts.map((c) => c.id));
    } else {
      setSelectedContactIds([]);
    }
  };

  const allSelected = contacts.length > 0 && selectedContactIds.length === contacts.length;
  const someSelected = selectedContactIds.length > 0 && !allSelected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setError("O conteudo da mensagem e obrigatorio.");
      return;
    }

    if (selectedContactIds.length === 0) {
      setError("Selecione pelo menos um contato para envio.");
      return;
    }

    let scheduledDate: Date | null = null;
    if (sendMode === "schedule") {
      if (!scheduledAtStr) {
        setError("Informe a data e o horario para o agendamento.");
        return;
      }

      scheduledDate = new Date(scheduledAtStr);
      if (isNaN(scheduledDate.getTime())) {
        setError("Data ou horario de agendamento invalido.");
        return;
      }

      if (scheduledDate.getTime() <= Date.now()) {
        setError("O horario de agendamento deve ser uma data no futuro.");
        return;
      }
    }

    try {
      setSubmitting(true);
      await onSubmit({
        body: trimmedBody,
        contactIds: selectedContactIds,
        scheduledAt: scheduledDate,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao processar mensagem.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.4)" },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="font-bold text-slate-900 tracking-tight text-xl pt-6 px-6 pb-2">
          {isEditing ? "Editar Mensagem Agendada" : "Nova Mensagem"}
        </DialogTitle>
        <DialogContent dividers className="px-6 py-4">
          {error && (
            <Alert severity="error" className="mb-5 rounded-xl border border-red-200">
              {error}
            </Alert>
          )}

          {/* Selecao de Contatos */}
          <Box className="mb-6">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="subtitle2" className="font-bold text-slate-800 text-sm">
                Destinatarios ({selectedContactIds.length} selecionado(s))
              </Typography>
              {contacts.length > 0 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      size="small"
                      color="primary"
                    />
                  }
                  label={<span className="text-xs font-medium text-slate-600">Selecionar todos</span>}
                />
              )}
            </Box>

            {contacts.length === 0 ? (
              <Alert severity="info" className="text-sm rounded-xl">
                Nenhum contato disponivel nesta conexao. Cadastre contatos antes de disparar mensagens.
              </Alert>
            ) : (
              <Paper
                variant="outlined"
                className="max-h-48 overflow-y-auto p-2.5 bg-slate-50/70 border-slate-200 rounded-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {contacts.map((contact) => (
                    <FormControlLabel
                      key={contact.id}
                      control={
                        <Checkbox
                          checked={selectedContactIds.includes(contact.id)}
                          onChange={() => handleToggleContact(contact.id)}
                          size="small"
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" className="font-semibold text-slate-800 text-xs">
                            {contact.name}
                          </Typography>
                          <Typography variant="caption" className="text-slate-500 text-[11px]">
                            {formatPhoneNumber(contact.phone)}
                          </Typography>
                        </Box>
                      }
                      className="m-0 px-2 py-1.5 hover:bg-white hover:shadow-xs rounded-lg transition-all border border-transparent hover:border-slate-200/60"
                    />
                  ))}
                </div>
              </Paper>
            )}
          </Box>

          {/* Corpo da Mensagem */}
          <Box className="mb-6">
            <Typography variant="subtitle2" className="font-bold text-slate-800 text-sm mb-2">
              Mensagem
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Digite aqui o texto da mensagem a ser enviada..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={submitting}
            />
          </Box>

          {/* Modo de Envio (Enviar agora vs Agendar) */}
          {!isEditing && (
            <FormControl component="fieldset" className="mb-4">
              <FormLabel component="legend" className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                Tipo de Disparo
              </FormLabel>
              <RadioGroup
                row
                value={sendMode}
                onChange={(e) => setSendMode(e.target.value as "now" | "schedule")}
                className="gap-4"
              >
                <FormControlLabel
                  value="now"
                  control={<Radio color="primary" />}
                  label={<span className="text-sm font-medium text-slate-700">Enviar agora (simulado)</span>}
                />
                <FormControlLabel
                  value="schedule"
                  control={<Radio color="primary" />}
                  label={<span className="text-sm font-medium text-slate-700">Agendar disparo</span>}
                />
              </RadioGroup>
            </FormControl>
          )}

          {/* Campo de Agendamento */}
          {(sendMode === "schedule" || isEditing) && (
            <Box className="mt-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <Typography variant="subtitle2" className="font-bold text-indigo-950 mb-1 text-sm">
                Programar Horario de Disparo
              </Typography>
              <TextField
                id="scheduled-datetime"
                label="Data e Horario"
                type="datetime-local"
                value={scheduledAtStr}
                onChange={(e) => setScheduledAtStr(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                disabled={submitting}
                className="bg-white mt-2 rounded-xl"
              />
              <Typography variant="caption" className="text-indigo-700 mt-2 block font-normal">
                A mensagem permanecera com status Agendada e sera enviada automaticamente no horario definido via Cloud Functions.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions className="px-6 py-4 flex justify-end gap-2 bg-slate-50/50 border-t border-slate-100">
          <Button onClick={onClose} disabled={submitting} color="inherit" className="text-slate-600">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || (contacts.length === 0 && !isEditing)}
            className="font-semibold shadow-sm px-5"
          >
            {submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditing ? (
              "Salvar Alteracoes"
            ) : sendMode === "schedule" ? (
              "Agendar Mensagem"
            ) : (
              "Enviar Mensagem"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

