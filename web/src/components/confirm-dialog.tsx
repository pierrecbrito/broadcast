import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.4)" },
        },
      }}
    >
      <DialogTitle className="font-bold text-slate-900 tracking-tight text-xl pt-6 px-6 pb-2">
        {title}
      </DialogTitle>
      <DialogContent className="px-6 py-2">
        <DialogContentText className="text-slate-600 text-sm leading-relaxed">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="px-6 pb-6 pt-3 flex justify-end gap-2 border-t border-slate-100">
        <Button onClick={onCancel} disabled={loading} color="inherit" className="text-slate-600">
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          autoFocus
          className="shadow-sm font-semibold px-5"
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Excluir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

