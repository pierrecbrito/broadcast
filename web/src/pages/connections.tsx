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
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Typography variant="h5" component="h1" className="font-bold text-slate-800">
            Conexoes
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Gerencie os canais de comunicacao da sua conta
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreate}
          className="font-semibold"
        >
          Nova Conexao
        </Button>
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
      ) : connections.length === 0 ? (
        <Card className="border border-dashed border-slate-300 p-12 text-center bg-white shadow-none">
          <Typography variant="h6" className="text-slate-700 font-semibold mb-2">
            Nenhuma conexao cadastrada
          </Typography>
          <Typography variant="body2" className="text-slate-500 mb-6">
            Crie sua primeira conexao para começar a gerenciar contatos e disparar mensagens.
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleOpenCreate}>
            Criar Conexao
          </Button>
        </Card>
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((conn) => (
            <Card
              key={conn.id}
              className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <CardContent>
                <Typography variant="h6" className="font-semibold text-slate-800 mb-1">
                  {conn.name}
                </Typography>
                <Typography variant="caption" className="text-slate-400 block">
                  Criada em: {conn.createdAt.toLocaleDateString("pt-BR")}
                </Typography>
              </CardContent>

              <CardActions className="p-4 pt-0 flex flex-wrap justify-between items-center gap-2 border-t border-slate-100">
                <Box className="flex gap-2">
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => navigate(`/connections/${conn.id}/contacts`)}
                    className="font-medium"
                  >
                    Contatos
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => navigate(`/connections/${conn.id}/messages`)}
                    className="font-medium"
                  >
                    Mensagens
                  </Button>
                </Box>
                <Box className="flex gap-1">
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => handleOpenEdit(conn)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleOpenDelete(conn)}
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
