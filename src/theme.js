// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ffc107" },
    background: { default: "#f4f6fc" },
  },
  // Extend with typography, spacing, shape, etc.
});

export default theme;
