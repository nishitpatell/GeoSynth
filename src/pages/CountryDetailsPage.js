import React from "react";
import { useParams } from "react-router-dom";
import useCountryProfile from "../hooks/useCountryProfile";
import { Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import GeographySection from "../components/country/GeographySection";
import EconomySection from "../components/country/EconomySection";
import InfoItem from "../components/country/InfoItem";

export default function CountryDetailsPage() {
  const { countryName } = useParams();
  const { profile, loading, error } = useCountryProfile(countryName);

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
    <Paper sx={{ p: 4, maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {profile.name.common}
      </Typography>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={4}
        mb={3}
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
          profile.languages ? Object.values(profile.languages).join(", ") : null
        }
      />

      <GeographySection
        subregion={profile.subregion}
        borders={profile.borders}
      />

      <EconomySection currencies={profile.currencies} />

      {/* You can add more sections here like GovernmentSection, CultureSection, etc. */}
    </Paper>
  );
}
