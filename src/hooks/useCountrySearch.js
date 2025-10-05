import { useState, useEffect } from "react";

const countriesApiUrl = process.env.PUBLIC_URL + "/world.geojson"; // Update if needed
// const countriesJsonUrl = process.env.PUBLIC_URL + "/world.geojson";

export default function useCountrySearch(globeRef) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load countries data when hook initializes
  useEffect(() => {
    fetch(countriesApiUrl)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.features);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load countries");
        setLoading(false);
      });
  }, []);

  // Search countries by name (case-insensitive)
  const searchCountry = (name) => {
    return countries.find(
      (c) =>
        c.properties.name.toLowerCase() === name.toLowerCase() ||
        c.properties.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  // Zoom globe to a country using centroid
  const zoomToCountry = (country) => {
    if (!country || !country.geometry) return;
    const centroid = getCentroid(country.geometry);
    if (globeRef.current && centroid) {
      globeRef.current.pointOfView(
        { lat: centroid[0], lng: centroid[1], altitude: 1.5 },
        1500
      );
    }
  };

  // Helper: calculate centroid
  const getCentroid = (geometry) => {
    let coords = [];
    if (geometry.type === "Polygon") {
      coords = geometry.coordinates[0];
    } else if (geometry.type === "MultiPolygon") {
      coords = geometry.coordinates[0][0];
    } else {
      return [0, 0];
    }
    let latSum = 0,
      lngSum = 0;
    coords.forEach(([lng, lat]) => {
      latSum += lat;
      lngSum += lng;
    });
    const len = coords.length;
    return [latSum / len, lngSum / len];
  };

  return {
    countries,
    loading,
    error,
    searchCountry,
    zoomToCountry,
  };
}
