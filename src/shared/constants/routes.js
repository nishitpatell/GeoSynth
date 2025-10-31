/**
 * Application Routes
 * Centralized route definitions
 */

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  NEWS: '/news',
  DEMOGRAPHICS: '/demographics',
  COUNTRY_PROFILE: '/country/:code',
  WISHLIST: '/wishlist',
  COMPARE: '/compare',
  CURRENCY: '/currency',
  PROFILE: '/profiles',
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
  ROUTES.CURRENCY,
  ROUTES.PROFILE,
];

/**
 * Public routes accessible without authentication
 */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH,
  ROUTES.NEWS,
  ROUTES.DEMOGRAPHICS,
];
