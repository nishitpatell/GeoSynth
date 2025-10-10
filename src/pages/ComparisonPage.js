import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useComparison } from "../context/ComparisonContext";

function CountryComparisonCard({ country, onRemove }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="120"
        image={country.flags.svg}
        alt={country.name.common}
        sx={{ objectFit: "contain", p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="h2">
            {country.name.common}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onRemove(country.name.common)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" gutterBottom>
          <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Region:</strong> {country.region}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Population:</strong> {country.population.toLocaleString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Area:</strong> {country.area.toLocaleString()} km²
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Languages:</strong>{" "}
          {country.languages
            ? Object.values(country.languages).slice(0, 2).join(", ")
            : "N/A"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Currency:</strong>{" "}
          {country.currencies
            ? Object.values(country.currencies)[0]?.name || "N/A"
            : "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useComparison();

  if (compareList.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No countries selected for comparison. Add countries from their detail
          pages.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Globe
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Country Comparison ({compareList.length})
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            Back to Globe
          </Button>
          <Button variant="outlined" color="error" onClick={clearCompare}>
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Comparison Cards Grid */}
      <Grid container spacing={3}>
        {compareList.map((country) => (
          <Grid item xs={12} sm={6} md={3} key={country.name.common}>
            <CountryComparisonCard
              country={country}
              onRemove={removeFromCompare}
            />
          </Grid>
        ))}
      </Grid>

      {/* Instructions */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "grey.50" }}>
        <Typography variant="body1" color="text.secondary">
          💡 <strong>How to use:</strong> Navigate to individual country pages
          from the globe and click "Add to Compare" to build your comparison
          list. You can compare up to 4 countries at once.
        </Typography>
      </Paper>
    </Box>
  );
}
