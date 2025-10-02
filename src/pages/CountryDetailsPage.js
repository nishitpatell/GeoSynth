import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCountryByName } from "../api/countryApi";

export default function CountryDetailsPage() {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCountryByName(countryName)
      .then((data) => {
        setCountry(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load country data");
        setLoading(false);
      });
  }, [countryName]);

  if (loading) return <p>Loading country information...</p>;
  if (error) return <p>{error}</p>;
  if (!country)
    return <p>No data available for {decodeURIComponent(countryName)}</p>;

  return (
    <div style={{ padding: 30 }}>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 4,
          fontSize: 16,
        }}
      >
        &#8592; Back to Globe
      </button>

      <h2>{country.name.common}</h2>
      <img
        src={country.flags.svg}
        alt={`${country.name.common} flag`}
        width="150"
      />
      <p>
        <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
      </p>
      <p>
        <strong>Region:</strong> {country.region}
      </p>
      <p>
        <strong>Population:</strong> {country.population.toLocaleString()}
      </p>
      <p>
        <strong>Area:</strong> {country.area.toLocaleString()} km²
      </p>
      <p>
        <strong>Languages:</strong>{" "}
        {country.languages
          ? Object.values(country.languages).join(", ")
          : "N/A"}
      </p>
    </div>
  );
}
