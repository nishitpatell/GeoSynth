/**
 * Supabase Client
 * Configured Supabase client instance
 */

import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';
import { logger } from '@/core/logger/logger';

// Validate environment variables
if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
  logger.error('Missing Supabase configuration');
  throw new Error('Supabase configuration is missing');
}

/**
 * Create Supabase client
 */
export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-application-name': 'geosynth',
      },
    },
  }
);

/**
 * Supabase helper functions
 */
export const supabaseHelpers = {
  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      logger.error('Error getting current user:', error);
      return null;
    }
    return user;
  },

  /**
   * Get current session
   */
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      logger.error('Error getting session:', error);
      return null;
    }
    return session;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const session = await this.getCurrentSession();
    return !!session;
  },
};

export default supabase;
