import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <span>Detalhes da Mensagem</span>
        <Chip
          label={isSent ? "Enviada" : "Agendada"}
          color={isSent ? "success" : "warning"}
          size="small"
          className="font-semibold"
        />
      </DialogTitle>
      <DialogContent dividers>
        {/* Metadados de Data */}
        <Box className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Typography variant="caption" className="text-slate-500 block">
              Criada em
            </Typography>
            <Typography variant="body2" className="font-medium text-slate-800">
              {message.createdAt.toLocaleString("pt-BR")}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className="text-slate-500 block">
              {isSent ? "Disparada em" : "Programada para"}
            </Typography>
            <Typography variant="body2" className="font-medium text-slate-800">
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
          <Typography variant="caption" className="text-slate-500 block mb-1">
            Texto da Mensagem
          </Typography>
          <Paper
            variant="outlined"
            className="p-3 bg-slate-50 text-slate-800 whitespace-pre-wrap font-sans text-sm border-slate-200"
          >
            {message.body}
          </Paper>
        </Box>

        <Divider className="my-4" />

        {/* Destinatarios */}
        <Box>
          <Typography variant="caption" className="text-slate-500 block mb-1">
            Destinatarios ({message.contactIds.length})
          </Typography>
          <Paper
            variant="outlined"
            className="max-h-40 overflow-y-auto p-2 bg-slate-50 border-slate-200"
          >
            {recipientContacts.length > 0 ? (
              <ul className="divide-y divide-slate-200 m-0 p-0 list-none">
                {recipientContacts.map((contact) => (
                  <li key={contact.id} className="py-1 px-2 flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-800">{contact.name}</span>
                    <span className="text-slate-500 text-xs">{formatPhoneNumber(contact.phone)}</span>
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
      <DialogActions className="px-6 py-3">
        <Button onClick={onClose} color="primary" variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
