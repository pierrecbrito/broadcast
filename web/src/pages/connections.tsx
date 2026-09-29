import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useConnections } from "../hooks/use-connections";
import { Connection } from "../types/connection";
import { ConnectionDialog } from "../components/connection-dialog";
import { ConfirmDialog } from "../components/confirm-dialog";

export function ConnectionsPage() {
  const navigate = useNavigate();
  const { connections, loading, error, create, update, remove } = useConnections();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingConnection, setDeletingConnection] = useState<Connection | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingConnection(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (conn: Connection) => {
    setEditingConnection(conn);
    setDialogOpen(true);
  };

  const handleSaveConnection = async (name: string) => {
    if (editingConnection) {
      await update(editingConnection.id, { name });
      setSnackbarMessage("Conexao atualizada com sucesso.");
    } else {
      await create({ name });
      setSnackbarMessage("Conexao criada com sucesso.");
    }
  };

  const handleOpenDelete = (conn: Connection) => {
    setDeletingConnection(conn);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingConnection) return;
    try {
      setDeleteLoading(true);
      await remove(deletingConnection.id);
      setConfirmOpen(false);
      setDeletingConnection(null);
      setSnackbarMessage("Conexao excluida com sucesso.");
    } catch {
      setSnackbarMessage("Erro ao excluir conexao.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      {/* Header section with refined typography and action button */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Typography variant="h5" component="h1" className="font-bold text-slate-900 tracking-tight">
              Conexoes
            </Typography>
            <Chip
              label={`${connections.length} ativa${connections.length === 1 ? "" : "s"}`}
              size="small"
              className="text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
            />
          </div>
          <Typography variant="body2" className="text-slate-500 font-normal">
            Gerencie os canais de comunicacao da sua conta
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenCreate}
          className="font-semibold shadow-sm px-4 py-2"
        >
          Nova Conexao
        </Button>
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
      ) : connections.length === 0 ? (
        <Card className="border border-dashed border-slate-300 p-12 text-center bg-white/60 backdrop-blur-xs rounded-2xl shadow-none">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <SensorsRoundedIcon fontSize="medium" />
          </div>
          <Typography variant="h6" className="text-slate-800 font-semibold mb-1">
            Nenhuma conexao cadastrada
          </Typography>
          <Typography variant="body2" className="text-slate-500 mb-6 max-w-md mx-auto">
            Crie sua primeira conexao para começar a gerenciar contatos e disparar mensagens.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreate}
            className="font-medium"
          >
            Criar Conexao
          </Button>
        </Card>
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((conn) => (
            <Card
              key={conn.id}
              className="group bg-white border border-slate-200/90 rounded-2xl shadow-subtle card-hover-effect flex flex-col justify-between overflow-hidden relative"
            >
              {/* Marca d'agua semi-transparente de ondas de broadcast / transmissao */}
              <div
                aria-hidden="true"
                className="absolute -right-7 -bottom-7 pointer-events-none select-none text-indigo-600/[0.05] group-hover:text-indigo-600/[0.09] group-hover:scale-105 transition-all duration-300 transform -rotate-12 z-0"
              >
                <SensorsRoundedIcon sx={{ fontSize: 160 }} />
              </div>

              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50/80 border border-indigo-100/70 text-indigo-600 flex items-center justify-center shadow-xs">
                    <SensorsRoundedIcon fontSize="small" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ativa
                  </div>
                </div>

                <Typography variant="h6" className="font-bold text-slate-900 mb-1 tracking-tight">
                  {conn.name}
                </Typography>
                <Typography variant="caption" className="text-slate-400 block font-normal">
                  Criada em: {conn.createdAt.toLocaleDateString("pt-BR")}
                </Typography>
              </CardContent>

              <CardActions className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 relative z-10">
                <Box className="flex gap-2">
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    startIcon={<PeopleOutlineRoundedIcon fontSize="small" />}
                    onClick={() => navigate(`/connections/${conn.id}/contacts`)}
                    className="font-semibold text-xs"
                  >
                    Contatos
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    startIcon={<ChatBubbleOutlineRoundedIcon fontSize="small" />}
                    onClick={() => navigate(`/connections/${conn.id}/messages`)}
                    className="font-semibold text-xs"
                  >
                    Mensagens
                  </Button>
                </Box>
                <Box className="flex gap-1">
                  <Button
                    size="small"
                    color="inherit"
                    startIcon={<EditOutlinedIcon fontSize="small" />}
                    onClick={() => handleOpenEdit(conn)}
                    className="text-xs text-slate-600"
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                    onClick={() => handleOpenDelete(conn)}
                    className="text-xs"
                  >
                    Excluir
                  </Button>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog Criar / Editar */}
      <ConnectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveConnection}
        initialData={editingConnection}
      />

      {/* Dialog Confirmar Exclusao */}
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir Conexao"
        message={`Tem certeza que deseja excluir a conexao "${deletingConnection?.name}"? Esta acao nao pode ser desfeita.`}
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

