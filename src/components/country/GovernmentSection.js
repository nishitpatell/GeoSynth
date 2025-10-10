import React from "react";
import { Box, Typography } from "@mui/material";
import InfoItem from "./InfoItem";

export default function GovernmentSection({ independent, unMember, status }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Government & Politics
      </Typography>
      <InfoItem label="Independent" value={independent ? "Yes" : "No"} />
      <InfoItem label="UN Member" value={unMember ? "Yes" : "No"} />
      <InfoItem label="Status" value={status} />
    </Box>
  );
}
