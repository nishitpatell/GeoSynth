/**
 * Auth Service
 * Business logic for authentication
 */

import { supabase } from '@/core/api/client/supabaseClient';
import { logger } from '@/core/logger/logger';
import { AuthError } from '@/core/errors';

class AuthService {
  /**
   * Sign up with email and password
   */
  async signUp(email, password, metadata = {}) {
    try {
      logger.info('Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: metadata,
        },
      });

      if (error) throw new AuthError(error.message);

      logger.info('User signed up successfully:', data.user?.id);
      return data;
    } catch (error) {
      logger.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      logger.info('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new AuthError(error.message);

      logger.info('User signed in successfully:', data.user?.id);
      return data;
    } catch (error) {
      logger.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider, options = {}) {
    try {
      logger.info('Signing in with OAuth:', provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          ...options,
        },
      });

      if (error) throw new AuthError(error.message);

      return data;
    } catch (error) {
      logger.error('OAuth sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      logger.info('Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new AuthError(error.message);

      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw new AuthError(error.message);
      
      return user;
    } catch (error) {
      logger.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw new AuthError(error.message);
      
      return session;
    } catch (error) {
      logger.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const session = await this.getCurrentSession();
    return !!session;
  }

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      logger.info('Resetting password for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw new AuthError(error.message);

      logger.info('Password reset email sent');
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword) {
    try {
      logger.info('Updating user password');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new AuthError(error.message);

      logger.info('Password updated successfully');
    } catch (error) {
      logger.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Update user metadata
   */
  async updateUserMetadata(metadata) {
    try {
      logger.info('Updating user metadata');
      
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) throw new AuthError(error.message);

      logger.info('User metadata updated');
      return data;
    } catch (error) {
      logger.error('Update metadata error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default AuthService;
