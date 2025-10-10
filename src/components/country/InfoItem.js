import React from "react";
import { Typography, Box } from "@mui/material";

export default function InfoItem({ label, value }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" component="span">
        {label}:&nbsp;
      </Typography>
      <Typography variant="body1" component="span">
        {value || "N/A"}
      </Typography>
    </Box>
  );
}
