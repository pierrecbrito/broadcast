import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
      light: "#6366f1",
      dark: "#4338ca",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b",
      light: "#94a3b8",
      dark: "#334155",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: [
      '"Plus Jakarta Sans"',
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.015em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.15s ease-in-out",
        },
        contained: {
          boxShadow: "0 1px 3px 0 rgba(79, 70, 229, 0.25), 0 1px 2px -1px rgba(79, 70, 229, 0.15)",
          "&:hover": {
            boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.35)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: "#e2e8f0",
          color: "#334155",
          "&:hover": {
            borderColor: "#cbd5e1",
            backgroundColor: "#f8fafc",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 4px 16px -2px rgba(15, 23, 42, 0.03)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& fieldset": {
            borderColor: "#e2e8f0",
          },
          "&:hover fieldset": {
            borderColor: "#cbd5e1",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#4f46e5",
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#f1f5f9",
        },
        head: {
          fontWeight: 600,
          color: "#475569",
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2.5,
          borderRadius: 2,
          backgroundColor: "#4f46e5",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          minHeight: 44,
          color: "#64748b",
          "&.Mui-selected": {
            color: "#4f46e5",
          },
        },
      },
    },
  },
});

