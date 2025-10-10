/**
 * Geometry Utilities
 * Helper functions for geographic calculations
 */

/**
 * Calculate the centroid of a GeoJSON geometry
 * @param {Object} geometry - GeoJSON geometry object
 * @returns {Array} [latitude, longitude]
 */
export const getCentroid = (geometry) => {
  if (!geometry) return [0, 0];

  let coords = [];
  
  if (geometry.type === "Polygon") {
    coords = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    // Use the first polygon of the multipolygon
    coords = geometry.coordinates[0][0];
  } else {
    return [0, 0];
  }

  let latSum = 0;
  let lngSum = 0;
  
  coords.forEach(([lng, lat]) => {
    latSum += lat;
    lngSum += lng;
  });

  const len = coords.length;
  return [latSum / len, lngSum / len];
};

/**
 * Calculate bounding box for a geometry
 * @param {Object} geometry - GeoJSON geometry object
 * @returns {Object} { minLat, maxLat, minLng, maxLng }
 */
export const getBoundingBox = (geometry) => {
  if (!geometry) return null;

  let coords = [];
  
  if (geometry.type === "Polygon") {
    coords = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    coords = geometry.coordinates.flat(2);
  }

  const lats = coords.map(([, lat]) => lat);
  const lngs = coords.map(([lng]) => lng);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
};

/**
 * Calculate distance between two points (Haversine formula)
 * @param {Array} point1 - [lat, lng]
 * @param {Array} point2 - [lat, lng]
 * @returns {Number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  const [lat1, lng1] = point1;
  const [lat2, lng2] = point2;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {Number} degrees
 * @returns {Number} radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};
