/**
 * API Endpoints Configuration
 */

export const API_ENDPOINTS = {
  // REST Countries API
  restCountries: {
    baseUrl: 'https://restcountries.com/v3.1',
    endpoints: {
      all: '/all',
      byCode: '/alpha/:code',
      byName: '/name/:name',
      byRegion: '/region/:region',
    },
  },

  // World Bank API
  worldBank: {
    baseUrl: 'https://api.worldbank.org/v2',
    endpoints: {
      countries: '/country',
      indicators: '/country/:code/indicator/:indicator',
    },
  },

  // Wikipedia API
  wikipedia: {
    baseUrl: 'https://en.wikipedia.org/api/rest_v1',
    endpoints: {
      summary: '/page/summary/:title',
    },
  },

  // News API (requires key)
  news: {
    baseUrl: 'https://newsapi.org/v2',
    endpoints: {
      topHeadlines: '/top-headlines',
      everything: '/everything',
    },
  },

  // OpenWeatherMap API (requires key)
  weather: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    endpoints: {
      current: '/weather',
      forecast: '/forecast',
    },
  },
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};
