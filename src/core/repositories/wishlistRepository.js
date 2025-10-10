/**
 * Wishlist Repository
 * Data access layer for wishlist operations
 */

import { supabase } from '../api/client/supabaseClient';
import { logger } from '../logger/logger';
import { AuthError, NotFoundError } from '../errors';

class WishlistRepository {
  constructor() {
    this.tableName = 'wishlists';
  }

  /**
   * Get user's wishlist
   */
  async getUserWishlist(userId) {
    if (!userId) {
      throw new AuthError('User ID is required');
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.debug(`Fetched wishlist for user ${userId}:`, data?.length);
      return data || [];
    } catch (error) {
      logger.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  /**
   * Add country to wishlist
   */
  async addToWishlist(userId, countryCode, countryName, notes = null) {
    if (!userId) {
      throw new AuthError('User ID is required');
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          user_id: userId,
          country_code: countryCode,
          country_name: countryName,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Added ${countryCode} to wishlist for user ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(userId, id) {
    if (!userId) {
      throw new AuthError('User ID is required');
    }

    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      logger.info(`Removed wishlist item ${id} for user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  /**
   * Check if country is in wishlist
   */
  async isInWishlist(userId, countryCode) {
    if (!userId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('user_id', userId)
        .eq('country_code', countryCode)
        .maybeSingle();

      if (error) throw error;

      return !!data;
    } catch (error) {
      logger.error('Error checking wishlist:', error);
      return false;
    }
  }

  /**
   * Update wishlist item notes
   */
  async updateNotes(userId, id, notes) {
    if (!userId) {
      throw new AuthError('User ID is required');
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ notes })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Updated notes for wishlist item ${id}`);
      return data;
    } catch (error) {
      logger.error('Error updating wishlist notes:', error);
      throw error;
    }
  }

  /**
   * Get wishlist item by country code
   */
  async getByCountryCode(userId, countryCode) {
    if (!userId) {
      throw new AuthError('User ID is required');
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('country_code', countryCode)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error fetching wishlist item:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const wishlistRepository = new WishlistRepository();
export default WishlistRepository;
