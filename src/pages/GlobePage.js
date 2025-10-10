import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import { Paper, Box, Typography } from "@mui/material";
import useCountrySearch from "../hooks/useCountrySearch";
import SearchBar from "../components/SearchBar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const globeImageUrl = process.env.PUBLIC_URL + "/earth-day.jpg";
const bumpImageUrl = process.env.PUBLIC_URL + "/earth-topology.png";

function GlobePage() {
  const globeEl = useRef();
  const navigate = useNavigate();
  const { countries, loading, error, searchCountry, zoomToCountry } =
    useCountrySearch(globeEl);

  const [hoverD, setHoverD] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const tryEnableAutoRotate = () => {
      if (globeEl.current && globeEl.current.controls) {
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.3;
          controls.enableZoom = true;
          globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2 });
        }
      } else {
        // Retry later if controls not ready
        requestAnimationFrame(tryEnableAutoRotate);
      }
    };

    tryEnableAutoRotate();
  }, []);

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = countries
        .map((c) => c.properties.name)
        .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
    const country = searchCountry(name);
    if (country) {
      zoomToCountry(country);
    }
  };

  const onSearchSubmit = (e) => {
    if (e.key === "Enter") {
      const country = searchCountry(searchTerm);
      if (country) {
        zoomToCountry(country);
        setSuggestions([]);
      } else {
        alert("Country not found");
      }
    }
  };

  const handlePolygonClick = (d) => {
    if (d && d.properties && d.properties.name) {
      navigate(`/country/${encodeURIComponent(d.properties.name)}`);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      sx={{
        height: "100vh",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.background.default} 60%, #e3f2fd 100%)`,
        pt: 6,
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Explore the World
      </Typography>
      <Box sx={{ mb: 4, width: 320 }}>
        <SearchBar
          value={searchTerm}
          suggestions={suggestions}
          onChange={onSearchChange}
          onKeyDown={onSearchSubmit}
          onSuggestionClick={onSuggestionClick}
          placeholder="Search for a country..."
        />
      </Box>
      <Paper
        elevation={8}
        sx={{
          width: { xs: "95vw", sm: "90vw", md: "70vw", lg: "60vw" },
          height: { xs: "60vw", sm: "50vw", md: "38vw", lg: "34vw" },
          minHeight: 400,
          minWidth: 340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: 6,
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Globe
              style={{ width: "100%", height: "100%" }}
              ref={globeEl}
              globeImageUrl={globeImageUrl}
              bumpImageUrl={bumpImageUrl}
              polygonsData={countries}
              polygonAltitude={(d) => (d === hoverD ? 0.04 : 0.005)}
              polygonCapColor={(d) =>
                d === hoverD ? "orange" : "rgba(80,200,255,0.08)"
              }
              polygonStrokeColor={() => "rgba(30,30,30,0.45)"}
              polygonSideColor={() => "rgba(0, 100, 0, 0.03)"}
              onPolygonHover={setHoverD}
              onPolygonClick={handlePolygonClick}
              polygonsTransitionDuration={300}
              backgroundColor="rgba(0,0,0,0)"
            />
          </Box>
          {hoverD && (
            <Box
              sx={{
                position: "absolute",
                bottom: 22,
                left: "50%",
                px: 2,
                py: 1,
                bgcolor: "rgba(44,62,80,0.88)",
                borderRadius: 2,
                color: "white",
                fontFamily: "Arial",
                fontWeight: 500,
                fontSize: 16,
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            >
              {hoverD.properties.name}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default GlobePage;
