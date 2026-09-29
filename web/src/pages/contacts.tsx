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
import Chip from "@mui/material/Chip";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useContacts } from "../hooks/use-contacts";
import { Contact } from "../types/contact";
import { ContactDialog } from "../components/contact-dialog";
import { ConfirmDialog } from "../components/confirm-dialog";
import { formatPhoneNumber } from "../utils/phone";

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
          startIcon={<ArrowBackRoundedIcon fontSize="small" />}
          onClick={() => navigate("/connections")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 -ml-2"
        >
          Voltar para Conexoes
        </Button>
      </Box>

      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Typography variant="h5" component="h1" className="font-bold text-slate-900 tracking-tight">
              Contatos {connectionName ? `- ${connectionName}` : ""}
            </Typography>
            <Chip
              label={`${contacts.length} cadastrado${contacts.length === 1 ? "" : "s"}`}
              size="small"
              className="text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
            />
          </div>
          <Typography variant="body2" className="text-slate-500 font-normal">
            Gerencie os contatos vinculados a esta conexao
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenCreate}
          className="font-semibold shadow-sm px-4 py-2"
        >
          Novo Contato
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
      ) : contacts.length === 0 ? (
        <Card className="border border-dashed border-slate-300 p-12 text-center bg-white/60 backdrop-blur-xs rounded-2xl shadow-none">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <PeopleOutlineRoundedIcon fontSize="medium" />
          </div>
          <Typography variant="h6" className="text-slate-800 font-semibold mb-1">
            Nenhum contato nesta conexao
          </Typography>
          <Typography variant="body2" className="text-slate-500 mb-6 max-w-md mx-auto">
            Cadastre os contatos que poderao receber suas mensagens de broadcast.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreate}
            className="font-medium"
          >
            Adicionar Primeiro Contato
          </Button>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          className="border border-slate-200/90 rounded-2xl shadow-subtle overflow-hidden bg-white"
        >
          <Table aria-label="tabela de contatos">
            <TableHead className="bg-slate-50/80">
              <TableRow>
                <TableCell className="font-bold text-slate-700 py-3.5 pl-6">Nome</TableCell>
                <TableCell className="font-bold text-slate-700 py-3.5">Telefone</TableCell>
                <TableCell className="font-bold text-slate-700 py-3.5">Cadastrado em</TableCell>
                <TableCell align="right" className="font-bold text-slate-700 py-3.5 pr-6">
                  Acoes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => {
                const initial = contact.name.trim().charAt(0).toUpperCase();

                return (
                  <TableRow
                    key={contact.id}
                    hover
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-100 to-indigo-50 border border-indigo-100/70 text-indigo-700 font-bold text-xs flex items-center justify-center shadow-xs">
                          {initial}
                        </div>
                        <span className="font-semibold text-slate-800 tracking-tight">
                          {contact.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 text-xs font-medium">
                        <PhoneOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
                        <span>{formatPhoneNumber(contact.phone)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-500 text-sm">
                      {contact.createdAt.toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell align="right" className="py-4 pr-6">
                      <Box className="inline-flex items-center gap-1">
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<EditOutlinedIcon fontSize="small" />}
                          onClick={() => handleOpenEdit(contact)}
                          className="text-xs text-slate-600 hover:text-indigo-600 px-2.5"
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                          onClick={() => handleOpenDelete(contact)}
                          className="text-xs px-2.5"
                        >
                          Excluir
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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

