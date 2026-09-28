import { Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useAuth } from "../hooks/use-auth";

export function AuthenticatedLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      // Ignora ou trata erro silenciosamente ao deslogar
    }
  };

  return (
    <Box className="min-h-screen flex flex-col bg-slate-50">
      <AppBar position="sticky" elevation={1} color="inherit" className="border-b border-slate-200">
        <Toolbar className="flex justify-between items-center max-w-7xl w-full mx-auto px-4">
          <Box className="flex items-center gap-3">
            <Typography variant="h6" component="div" className="font-bold text-slate-800 tracking-tight">
              Broadcast
            </Typography>
            <Chip
              label="SaaS"
              size="small"
              color="primary"
              variant="outlined"
              className="font-semibold text-xs"
            />
          </Box>

          <Box className="flex items-center gap-4">
            {user?.email && (
              <Typography variant="body2" className="text-slate-600 hidden sm:block">
                {user.email}
              </Typography>
            )}
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleLogout}
              className="font-medium"
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </Box>
    </Box>
  );
}
