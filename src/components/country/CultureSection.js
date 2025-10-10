import React from "react";
import { Box, Typography } from "@mui/material";
import InfoItem from "./InfoItem";

export default function CultureSection({ demonyms, timezones }) {
  const demonymStr = demonyms?.eng
    ? `${demonyms.eng.m} / ${demonyms.eng.f}`
    : "N/A";

  const timezoneStr = timezones?.join(", ");

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Culture & Demographics
      </Typography>
      <InfoItem label="Demonyms" value={demonymStr} />
      <InfoItem label="Timezones" value={timezoneStr} />
    </Box>
  );
}
