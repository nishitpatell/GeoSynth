/**
 * Shared Constants
 */

export * from './routes';

export const APP_NAME = 'Geosynth';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CACHE_PREFIX: 'cache_',
};

export const QUERY_KEYS = {
  COUNTRIES: 'countries',
  COUNTRY: 'country',
  WISHLIST: 'wishlist',
  USER: 'user',
  NEWS: 'news',
  WEATHER: 'weather',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please sign in to access this feature.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
  AUTH_SUCCESS: 'Signed in successfully!',
  LOGOUT_SUCCESS: 'Signed out successfully',
  WISHLIST_ADDED: 'Added to wishlist',
  WISHLIST_REMOVED: 'Removed from wishlist',
  PROFILE_UPDATED: 'Profile updated successfully',
};
