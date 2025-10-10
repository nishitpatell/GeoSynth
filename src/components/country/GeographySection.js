import React from "react";
import { Box, Typography } from "@mui/material";
import InfoItem from "./InfoItem";

export default function GeographySection({ subregion, borders }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Geography
      </Typography>
      <InfoItem label="Subregion" value={subregion} />
      <InfoItem label="Borders" value={borders?.join(", ")} />
    </Box>
  );
}
