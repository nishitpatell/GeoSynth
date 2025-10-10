import { useState, useEffect } from "react";
import { fetchCountryProfile } from "../api/countryProfileApi";

export default function useCountryProfile(countryName) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryName) return;
    setLoading(true);
    fetchCountryProfile(countryName)
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch profile");
        setLoading(false);
      });
  }, [countryName]);

  return { profile, loading, error };
}
