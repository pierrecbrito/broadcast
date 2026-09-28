import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useMessages } from "../hooks/use-messages";
import { Message, MessageStatus, CreateMessageInput } from "../types/message";
import { MessageDialog } from "../components/message-dialog";
import { MessageDetailsDialog } from "../components/message-details-dialog";
import { ConfirmDialog } from "../components/confirm-dialog";

export function MessagesPage() {
  const { id: connectionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const {
    messages,
    connectionName,
    contacts,
    loading,
    error,
    create,
    update,
    remove,
  } = useMessages(connectionId || "", statusFilter);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingMessage(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (msg: Message) => {
    setEditingMessage(msg);
    setDialogOpen(true);
  };

  const handleOpenDetails = (msg: Message) => {
    setViewingMessage(msg);
    setDetailsOpen(true);
  };

  const handleSaveMessage = async (input: CreateMessageInput) => {
    if (editingMessage) {
      await update(editingMessage.id, input);
      setSnackbarMessage("Mensagem agendada atualizada com sucesso.");
    } else {
      await create(input);
      if (input.scheduledAt) {
        setSnackbarMessage("Mensagem agendada com sucesso.");
      } else {
        setSnackbarMessage("Mensagem enviada com sucesso (simulado).");
      }
    }
  };

  const handleOpenDelete = (msg: Message) => {
    setDeletingMessage(msg);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    try {
      setDeleteLoading(true);
      await remove(deletingMessage.id);
      setConfirmOpen(false);
      setDeletingMessage(null);
      setSnackbarMessage("Mensagem excluida com sucesso.");
    } catch {
      setSnackbarMessage("Erro ao excluir mensagem.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFilterChange = (
    _event: React.SyntheticEvent,
    newValue: MessageStatus | "all"
  ) => {
    setStatusFilter(newValue);
  };

  return (
    <Box>
      <Box className="mb-4">
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/connections")}
          className="mb-2"
        >
          &larr; Voltar para Conexoes
        </Button>
      </Box>

      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Typography variant="h5" component="h1" className="font-bold text-slate-800">
            Mensagens {connectionName ? `- ${connectionName}` : ""}
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Envio e agendamento de broadcasts para contatos
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreate}
          className="font-semibold"
        >
          Nova Mensagem
        </Button>
      </Box>

      {/* Tabs de Filtro por Status */}
      <Box className="border-b border-slate-200 mb-6">
        <Tabs value={statusFilter} onChange={handleFilterChange} aria-label="filtro de status">
          <Tab label="Todas" value="all" className="font-semibold" />
          <Tab label="Enviadas" value="sent" className="font-semibold" />
          <Tab label="Agendadas" value="scheduled" className="font-semibold" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="flex justify-center items-center py-16">
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Card className="border border-dashed border-slate-300 p-12 text-center bg-white shadow-none">
          <Typography variant="h6" className="text-slate-700 font-semibold mb-2">
            Nenhuma mensagem encontrada
          </Typography>
          <Typography variant="body2" className="text-slate-500 mb-6">
            {statusFilter === "sent"
              ? "Nenhuma mensagem enviada nesta conexao."
              : statusFilter === "scheduled"
              ? "Nenhuma mensagem agendada no momento."
              : "Dispare sua primeira mensagem agora ou agende para um horario futuro."}
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleOpenCreate}>
            Criar Mensagem
          </Button>
        </Card>
      ) : (
        <Box className="space-y-4">
          {messages.map((msg) => {
            const isSent = msg.status === "sent";

            return (
              <Card
                key={msg.id}
                className="border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
              >
                <CardContent className="p-4 sm:p-5">
                  <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <Box className="flex items-center gap-2 flex-wrap">
                      <Chip
                        label={isSent ? "Enviada" : "Agendada"}
                        color={isSent ? "success" : "warning"}
                        size="small"
                        className="font-semibold text-xs"
                      />
                      <Typography variant="caption" className="text-slate-500">
                        {isSent
                          ? `Enviada em: ${
                              msg.sentAt
                                ? msg.sentAt.toLocaleString("pt-BR")
                                : msg.createdAt.toLocaleString("pt-BR")
                            }`
                          : `Agendada para: ${
                              msg.scheduledAt
                                ? msg.scheduledAt.toLocaleString("pt-BR")
                                : "-"
                            }`}
                      </Typography>
                    </Box>

                    <Typography variant="caption" className="text-slate-500">
                      {msg.contactIds.length} contato(s) selecionado(s)
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    className="text-slate-800 line-clamp-2 mb-4 font-normal"
                  >
                    {msg.body}
                  </Typography>

                  <Box className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDetails(msg)}
                      className="font-medium"
                    >
                      Ver Detalhes
                    </Button>

                    <Box className="flex gap-2">
                      {!isSent && (
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => handleOpenEdit(msg)}
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpenDelete(msg)}
                      >
                        Excluir
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Dialog Criar / Editar Mensagem */}
      <MessageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveMessage}
        contacts={contacts}
        initialData={editingMessage}
      />

      {/* Dialog Detalhes da Mensagem */}
      <MessageDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        message={viewingMessage}
        contacts={contacts}
      />

      {/* Dialog Confirmar Exclusao */}
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir Mensagem"
        message="Tem certeza que deseja excluir esta mensagem? Esta acao nao pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleteLoading}
      />

      {/* Snackbar de Feedback */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        message={snackbarMessage}
      />
    </Box>
  );
}
