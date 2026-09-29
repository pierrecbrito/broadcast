import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Message } from "../types/message";
import { Contact } from "../types/contact";
import { formatPhoneNumber } from "../utils/phone";

type MessageDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  message: Message | null;
  contacts: Contact[];
};

export function MessageDetailsDialog({
  open,
  onClose,
  message,
  contacts,
}: MessageDetailsDialogProps) {
  if (!message) return null;

  const isSent = message.status === "sent";

  // Encontra os contatos associados aos IDs
  const recipientContacts = contacts.filter((c) =>
    message.contactIds.includes(c.id)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.4)" },
        },
      }}
    >
      <DialogTitle className="flex justify-between items-center pt-6 px-6 pb-3">
        <span className="font-bold text-slate-900 tracking-tight text-xl">Detalhes da Mensagem</span>
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isSent
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
              : "bg-amber-50 text-amber-700 border-amber-200/60"
          }`}
        >
          {isSent ? (
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 13 }} />
          ) : (
            <AccessTimeRoundedIcon sx={{ fontSize: 13 }} />
          )}
          <span>{isSent ? "Enviada" : "Agendada"}</span>
        </div>
      </DialogTitle>
      <DialogContent dividers className="px-6 py-4">
        {/* Metadados de Data */}
        <Box className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <Typography variant="caption" className="text-slate-400 font-medium block mb-0.5">
              Criada em
            </Typography>
            <Typography variant="body2" className="font-semibold text-slate-800 text-xs sm:text-sm">
              {message.createdAt.toLocaleString("pt-BR")}
            </Typography>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <Typography variant="caption" className="text-slate-400 font-medium block mb-0.5">
              {isSent ? "Disparada em" : "Programada para"}
            </Typography>
            <Typography variant="body2" className="font-semibold text-slate-800 text-xs sm:text-sm">
              {isSent
                ? message.sentAt
                  ? message.sentAt.toLocaleString("pt-BR")
                  : "Imediato"
                : message.scheduledAt
                ? message.scheduledAt.toLocaleString("pt-BR")
                : "-"}
            </Typography>
          </div>
        </Box>

        <Divider className="my-4" />

        {/* Conteudo da Mensagem */}
        <Box className="mb-4">
          <Typography variant="caption" className="text-slate-500 font-bold block mb-1.5 text-xs uppercase tracking-wider">
            Texto da Mensagem
          </Typography>
          <Paper
            variant="outlined"
            className="p-4 bg-slate-50/80 text-slate-800 whitespace-pre-wrap font-sans text-sm border-slate-200/80 rounded-xl leading-relaxed"
          >
            {message.body}
          </Paper>
        </Box>

        <Divider className="my-4" />

        {/* Destinatarios */}
        <Box>
          <Typography variant="caption" className="text-slate-500 font-bold block mb-1.5 text-xs uppercase tracking-wider">
            Destinatarios ({message.contactIds.length})
          </Typography>
          <Paper
            variant="outlined"
            className="max-h-44 overflow-y-auto p-2 bg-slate-50/80 border-slate-200/80 rounded-xl"
          >
            {recipientContacts.length > 0 ? (
              <ul className="divide-y divide-slate-100 m-0 p-0 list-none">
                {recipientContacts.map((contact) => (
                  <li key={contact.id} className="py-1.5 px-2.5 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{contact.name}</span>
                    <span className="text-slate-500 text-[11px] font-medium">{formatPhoneNumber(contact.phone)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" className="text-slate-500 p-2 text-xs">
                {message.contactIds.length} contato(s) associado(s) (IDs: {message.contactIds.join(", ")})
              </Typography>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-end">
        <Button onClick={onClose} color="primary" variant="contained" className="font-semibold shadow-sm px-5">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

