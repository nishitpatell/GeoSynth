/**
 * Application Routes
 * Centralized route definitions
 */

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  COUNTRY_PROFILE: '/country/:code',
  WISHLIST: '/wishlist',
  COMPARE: '/compare',
  NOT_FOUND: '*',
};

/**
 * Generate route with parameters
 */
export const generateRoute = {
  countryProfile: (code) => `/country/${code}`,
  auth: (mode) => mode ? `/auth?mode=${mode}` : '/auth',
};

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.WISHLIST,
  ROUTES.COMPARE,
];

/**
 * Public routes accessible without authentication
 */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH,
];
