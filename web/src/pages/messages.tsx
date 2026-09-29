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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
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
          startIcon={<ArrowBackRoundedIcon fontSize="small" />}
          onClick={() => navigate("/connections")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 -ml-2"
        >
          Voltar para Conexoes
        </Button>
      </Box>

      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Typography variant="h5" component="h1" className="font-bold text-slate-900 tracking-tight">
              Mensagens {connectionName ? `- ${connectionName}` : ""}
            </Typography>
            <Chip
              label={`${messages.length} listada${messages.length === 1 ? "" : "s"}`}
              size="small"
              className="text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
            />
          </div>
          <Typography variant="body2" className="text-slate-500 font-normal">
            Envio e agendamento de broadcasts para contatos
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendRoundedIcon />}
          onClick={handleOpenCreate}
          className="font-semibold shadow-sm px-4 py-2"
        >
          Nova Mensagem
        </Button>
      </Box>

      {/* Tabs de Filtro por Status */}
      <Box className="border-b border-slate-200 mb-8">
        <Tabs
          value={statusFilter}
          onChange={handleFilterChange}
          aria-label="filtro de status"
          className="min-h-0"
        >
          <Tab label="Todas" value="all" className="font-semibold" />
          <Tab label="Enviadas" value="sent" className="font-semibold" />
          <Tab label="Agendadas" value="scheduled" className="font-semibold" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6 rounded-xl border border-red-200">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="flex justify-center items-center py-24">
          <CircularProgress size={36} thickness={4} />
        </Box>
      ) : messages.length === 0 ? (
        <Card className="border border-dashed border-slate-300 p-12 text-center bg-white/60 backdrop-blur-xs rounded-2xl shadow-none">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <ChatBubbleOutlineRoundedIcon fontSize="medium" />
          </div>
          <Typography variant="h6" className="text-slate-800 font-semibold mb-1">
            Nenhuma mensagem encontrada
          </Typography>
          <Typography variant="body2" className="text-slate-500 mb-6 max-w-md mx-auto">
            {statusFilter === "sent"
              ? "Nenhuma mensagem enviada nesta conexao."
              : statusFilter === "scheduled"
              ? "Nenhuma mensagem agendada no momento."
              : "Dispare sua primeira mensagem agora ou agende para um horario futuro."}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SendRoundedIcon />}
            onClick={handleOpenCreate}
            className="font-medium"
          >
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
                className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle card-hover-effect overflow-hidden"
              >
                <CardContent className="p-5 sm:p-6">
                  <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <Box className="flex items-center gap-2.5 flex-wrap">
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

                      <Typography variant="caption" className="text-slate-400 font-medium">
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

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-xs font-medium">
                      <PeopleOutlineRoundedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
                      <span>{msg.contactIds.length} contato(s) selecionado(s)</span>
                    </div>
                  </Box>

                  <Box className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 mb-4">
                    <Typography
                      variant="body1"
                      className="text-slate-800 line-clamp-3 font-normal leading-relaxed text-sm sm:text-base"
                    >
                      {msg.body}
                    </Typography>
                  </Box>

                  <Box className="flex justify-between items-center pt-1">
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                      onClick={() => handleOpenDetails(msg)}
                      className="font-semibold text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Ver Detalhes
                    </Button>

                    <Box className="flex gap-1">
                      {!isSent && (
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<EditOutlinedIcon fontSize="small" />}
                          onClick={() => handleOpenEdit(msg)}
                          className="text-xs text-slate-600"
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                        onClick={() => handleOpenDelete(msg)}
                        className="text-xs"
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

