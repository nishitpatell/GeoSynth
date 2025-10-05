import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import useCountrySearch from "../hooks/useCountrySearch";

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
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={onSearchChange}
        onKeyDown={onSearchSubmit}
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          padding: "8px 12px",
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          width: 250,
        }}
      />

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: 52,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            listStyleType: "none",
            padding: 0,
            margin: 0,
            width: 250,
            maxHeight: 180,
            overflowY: "auto",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {suggestions.map((name, idx) => (
            <li
              key={idx}
              onClick={() => onSuggestionClick(name)}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={(e) => e.preventDefault()} // prevents input losing focus
            >
              {name}
            </li>
          ))}
        </ul>
      )}

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
