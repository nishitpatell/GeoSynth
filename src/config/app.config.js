/**
 * Application Configuration
 */

export const APP_CONFIG = {
  name: 'Geosynth',
  version: '1.0.0',
  description: 'Explore comprehensive information about every country',
  
  // Cache settings
  cache: {
    ttl: 1000 * 60 * 60, // 1 hour
    maxSize: 100, // Max items in memory cache
  },
  
  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Features
  features: {
    enableGoogleAuth: true,
    enableNewsIntegration: false,
    enableWeatherIntegration: false,
  },
};
