/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const ENV = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,

  // API Keys (to be added)
  NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY,
  WEATHER_API_KEY: import.meta.env.VITE_WEATHER_API_KEY,

  // App Config
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

/**
 * Validate required environment variables
 */
export const validateEnv = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  
  const missing = required.filter(key => !ENV[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};
