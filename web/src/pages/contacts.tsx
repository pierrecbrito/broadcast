import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContacts } from "../hooks/use-contacts";
import { Contact } from "../types/contact";
import { ContactDialog } from "../components/contact-dialog";
import { ConfirmDialog } from "../components/confirm-dialog";

export function ContactsPage() {
  const { id: connectionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { contacts, connectionName, loading, error, create, update, remove } = useContacts(
    connectionId || ""
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingContact(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleSaveContact = async (name: string, phone: string) => {
    if (editingContact) {
      await update(editingContact.id, { name, phone });
      setSnackbarMessage("Contato atualizado com sucesso.");
    } else {
      await create({ name, phone });
      setSnackbarMessage("Contato criado com sucesso.");
    }
  };

  const handleOpenDelete = (contact: Contact) => {
    setDeletingContact(contact);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingContact) return;
    try {
      setDeleteLoading(true);
      await remove(deletingContact.id);
      setConfirmOpen(false);
      setDeletingContact(null);
      setSnackbarMessage("Contato excluido com sucesso.");
    } catch {
      setSnackbarMessage("Erro ao excluir contato.");
    } finally {
      setDeleteLoading(false);
    }
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
            Contatos {connectionName ? `- ${connectionName}` : ""}
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Gerencie os contatos vinculados a esta conexao
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreate}
          className="font-semibold"
        >
          Novo Contato
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
      ) : contacts.length === 0 ? (
        <Card className="border border-dashed border-slate-300 p-12 text-center bg-white shadow-none">
          <Typography variant="h6" className="text-slate-700 font-semibold mb-2">
            Nenhum contato nesta conexao
          </Typography>
          <Typography variant="body2" className="text-slate-500 mb-6">
            Cadastre os contatos que poderao receber suas mensagens de broadcast.
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleOpenCreate}>
            Adicionar Primeiro Contato
          </Button>
        </Card>
      ) : (
        <TableContainer component={Paper} className="border border-slate-200 shadow-sm">
          <Table aria-label="tabela de contatos">
            <TableHead className="bg-slate-100">
              <TableRow>
                <TableCell className="font-bold text-slate-700">Nome</TableCell>
                <TableCell className="font-bold text-slate-700">Telefone</TableCell>
                <TableCell className="font-bold text-slate-700">Cadastrado em</TableCell>
                <TableCell align="right" className="font-bold text-slate-700">
                  Acoes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  <TableCell className="font-medium text-slate-800">
                    {contact.name}
                  </TableCell>
                  <TableCell className="text-slate-600">{contact.phone}</TableCell>
                  <TableCell className="text-slate-500">
                    {contact.createdAt.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => handleOpenEdit(contact)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleOpenDelete(contact)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog Criar / Editar Contato */}
      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveContact}
        initialData={editingContact}
      />

      {/* Dialog Confirmar Exclusao */}
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir Contato"
        message={`Tem certeza que deseja excluir o contato "${deletingContact?.name}"?`}
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
