import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCountryProfile from "../hooks/useCountryProfile";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeographySection from "../components/country/GeographySection";
import EconomySection from "../components/country/EconomySection";
import GovernmentSection from "../components/country/GovernmentSection";
import CultureSection from "../components/country/CultureSection";
import InfoItem from "../components/country/InfoItem";
import { useComparison } from "../context/ComparisonContext";

export default function CountryDetailsPage() {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const { profile, loading, error } = useCountryProfile(countryName);
  const { addToCompare, compareList } = useComparison();

  // Add null check for profile before using it
  const isInCompare =
    profile && compareList.find((c) => c.name.common === profile.name.common);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

  if (!profile)
    return (
      <Typography variant="h6" sx={{ m: 2 }}>
        No country information available.
      </Typography>
    );

  return (
    <Paper sx={{ p: 4, maxWidth: 900, margin: "auto", mt: 4 }}>
      {/* Back Button and Add to Compare */}
      <Box mb={2} display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Globe
        </Button>
        <Button
          variant="contained"
          disabled={isInCompare || compareList.length >= 4}
          onClick={() => addToCompare(profile)}
        >
          {isInCompare ? "Already in Compare" : "Add to Compare"}
        </Button>
      </Box>

      {/* Rest of your existing component code... */}

      {/* Country Header */}
      <Typography variant="h4" gutterBottom>
        {profile.name.common}
      </Typography>

      {/* Flag and Coat of Arms */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={4}
        mb={4}
      >
        <Box
          component="img"
          src={profile.flags.svg}
          alt={profile.name.common}
          sx={{ width: 200, borderRadius: 1, boxShadow: 3 }}
        />
        {profile.coatOfArms?.svg && (
          <Box
            component="img"
            src={profile.coatOfArms.svg}
            alt={`${profile.name.common} coat of arms`}
            sx={{ width: 100, borderRadius: 1, boxShadow: 3 }}
          />
        )}
      </Box>

      {/* Basic Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <InfoItem label="Capital" value={profile.capital?.[0]} />
        <InfoItem label="Region" value={profile.region} />
        <InfoItem
          label="Population"
          value={profile.population.toLocaleString()}
        />
        <InfoItem label="Area" value={`${profile.area.toLocaleString()} km²`} />
        <InfoItem
          label="Languages"
          value={
            profile.languages
              ? Object.values(profile.languages).join(", ")
              : null
          }
        />
      </Box>

      {/* Geography Section */}
      <GeographySection
        subregion={profile.subregion}
        borders={profile.borders}
      />

      {/* Economy Section */}
      <EconomySection currencies={profile.currencies} />

      {/* Government Section */}
      <GovernmentSection
        independent={profile.independent}
        unMember={profile.unMember}
        status={profile.status}
      />

      {/* Culture Section */}
      <CultureSection
        demonyms={profile.demonyms}
        timezones={profile.timezones}
      />
    </Paper>
  );
}
