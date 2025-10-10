import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// In future, you can inject nav/menu/buttons/etc. using props/children
export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            World Explorer
          </Typography>
          {/* In the future, add nav/menu/user actions here */}
        </Toolbar>
      </AppBar>
      {/* Responsive layout container */}
      <Container maxWidth={false} sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
