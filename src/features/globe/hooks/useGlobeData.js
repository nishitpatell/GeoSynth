/**
 * useGlobeData Hook
 * Handles loading and managing globe GeoJSON data
 */

import { useState, useEffect } from 'react';

const GLOBE_DATA_URL = '/assets/globe/world.geojson';

export const useGlobeData = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGlobeData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🌍 Loading globe data from:', GLOBE_DATA_URL);
        const response = await fetch(GLOBE_DATA_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to load globe data: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Globe data loaded:', data.features?.length, 'countries');
        
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('Invalid GeoJSON format');
        }

        setCountries(data.features);
      } catch (err) {
        console.error('❌ Error loading globe data:', err);
        setError(err.message || 'Failed to load globe data');
      } finally {
        setLoading(false);
      }
    };

    loadGlobeData();
  }, []);

  /**
   * Search for a country by name
   * @param {string} name - Country name to search for
   * @returns {Object|null} Country feature or null
   */
  const searchCountry = (name) => {
    if (!name || !countries.length) return null;

    const searchTerm = name.toLowerCase().trim();
    
    return countries.find((country) => {
      const countryName = country.properties?.name?.toLowerCase() || '';
      return countryName === searchTerm || countryName.includes(searchTerm);
    });
  };

  /**
   * Get country by exact name match
   * @param {string} name - Exact country name
   * @returns {Object|null} Country feature or null
   */
  const getCountryByName = (name) => {
    if (!name || !countries.length) return null;

    return countries.find(
      (country) => 
        country.properties?.name?.toLowerCase() === name.toLowerCase()
    );
  };

  /**
   * Get all country names for autocomplete
   * @returns {Array<string>} Array of country names
   */
  const getCountryNames = () => {
    return countries
      .map((country) => country.properties?.name)
      .filter(Boolean)
      .sort();
  };

  return {
    countries,
    loading,
    error,
    searchCountry,
    getCountryByName,
    getCountryNames,
  };
};
