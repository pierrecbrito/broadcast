import { Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
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

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <Box className="min-h-screen flex flex-col bg-slate-50 ambient-bg relative overflow-x-hidden">
      {/* Decorative ambient background glows */}
      <div className="ambient-glow" />
      <div className="ambient-glow-left" />

      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        className="glass-nav sticky top-0 z-40"
      >
        <Toolbar className="flex justify-between items-center max-w-7xl w-full mx-auto px-4 sm:px-6 py-1">
          <Box className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-sm shadow-indigo-500/25">
              <SensorsRoundedIcon fontSize="small" />
            </div>
            <Typography
              variant="h6"
              component="div"
              className="font-bold text-slate-900 tracking-tight text-lg"
            >
              Broadcast
            </Typography>
            <Chip
              label="SaaS"
              size="small"
              color="primary"
              variant="outlined"
              className="font-semibold text-[11px] h-5 px-1 bg-indigo-50/50 border-indigo-200 text-indigo-700"
            />
          </Box>

          <Box className="flex items-center gap-3 sm:gap-4">
            {user?.email && (
              <Box className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userInitial}
                </div>
                <Typography
                  variant="body2"
                  className="text-slate-700 font-medium text-xs hidden sm:block max-w-[200px] truncate"
                >
                  {user.email}
                </Typography>
              </Box>
            )}
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<LogoutRoundedIcon fontSize="small" />}
              onClick={handleLogout}
              className="font-medium text-xs rounded-lg px-3 py-1.5"
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <Outlet />
      </Box>
    </Box>
  );
}
