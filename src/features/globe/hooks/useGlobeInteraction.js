/**
 * useGlobeInteraction Hook
 * Manages globe user interactions (hover, click, zoom)
 */

import { useState, useCallback } from 'react';
import { getCentroid } from '../utils/geometryUtils';

export const useGlobeInteraction = (globeRef) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  /**
   * Handle country hover
   */
  const handleCountryHover = useCallback((country) => {
    setHoveredCountry(country);
  }, []);

  /**
   * Handle country click
   */
  const handleCountryClick = useCallback((country) => {
    setSelectedCountry(country);
  }, []);

  /**
   * Zoom globe to a specific country
   * @param {Object} country - GeoJSON feature
   * @param {number} duration - Animation duration in ms
   */
  const zoomToCountry = useCallback((country, duration = 1500) => {
    if (!country || !country.geometry || !globeRef.current) return;

    const centroid = getCentroid(country.geometry);
    
    if (centroid && centroid[0] !== 0 && centroid[1] !== 0) {
      globeRef.current.pointOfView(
        {
          lat: centroid[0],
          lng: centroid[1],
          altitude: 1.5,
        },
        duration
      );
    }
  }, [globeRef]);

  /**
   * Reset globe to default view
   */
  const resetView = useCallback(() => {
    if (!globeRef.current) return;

    globeRef.current.pointOfView(
      {
        lat: 0,
        lng: 0,
        altitude: 2,
      },
      1000
    );
    
    setHoveredCountry(null);
    setSelectedCountry(null);
  }, [globeRef]);

  /**
   * Enable/disable auto-rotation
   */
  const setAutoRotate = useCallback((enabled, speed = 0.3) => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = enabled;
      controls.autoRotateSpeed = speed;
    }
  }, [globeRef]);

  return {
    hoveredCountry,
    selectedCountry,
    handleCountryHover,
    handleCountryClick,
    zoomToCountry,
    resetView,
    setAutoRotate,
  };
};
