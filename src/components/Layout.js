import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useComparison } from "../context/ComparisonContext";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { compareList } = useComparison();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            World Explorer
          </Typography>
          <Button color="inherit" onClick={() => navigate("/compare")}>
            <Badge badgeContent={compareList.length} color="secondary">
              Compare
            </Badge>
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
