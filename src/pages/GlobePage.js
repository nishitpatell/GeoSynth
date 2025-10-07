import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import useCountrySearch from "../hooks/useCountrySearch";
import SearchBar from "../components/SearchBar";

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

  // This useEffect will set auto-rotate when the globe ref is available
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2 });
    }
  }, [globeEl]);

  // Update suggestions as user types
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = countries
        .map((c) => c.properties.name)
        .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 10); // limit suggestions to 10
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // When suggestion clicked, zoom and update search box
  const onSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
    const country = searchCountry(name);
    if (country) {
      zoomToCountry(country);
    }
  };

  // When user presses Enter in search box
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

  // When a polygon (country) is clicked, go to the details route
  const handlePolygonClick = (d) => {
    if (d && d.properties && d.properties.name) {
      navigate(`/country/${encodeURIComponent(d.properties.name)}`);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <SearchBar
          value={searchTerm}
          suggestions={suggestions}
          onChange={onSearchChange}
          onKeyDown={onSearchSubmit}
          onSuggestionClick={onSuggestionClick}
          placeholder="Search for a country..."
        />
      </div>
      <Globe
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
        backgroundColor="#000000"
      />
      {hoverD && (
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            padding: "6px 12px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            fontFamily: "Arial",
            fontSize: 14,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          {hoverD.properties.name}
        </div>
      )}
    </div>
  );
}

export default GlobePage;
