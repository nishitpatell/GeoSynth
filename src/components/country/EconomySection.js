import React from "react";
import { Box, Typography } from "@mui/material";
import InfoItem from "./InfoItem";

export default function EconomySection({ currencies }) {
  const currencyStr = currencies
    ? Object.values(currencies)
        .map(({ name, symbol }) => `${name} (${symbol})`)
        .join(", ")
    : "N/A";

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Economy
      </Typography>
      <InfoItem label="Currencies" value={currencyStr} />
    </Box>
  );
}
