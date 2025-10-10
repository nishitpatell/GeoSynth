/**
 * Wishlist Service
 * Business logic for wishlist operations
 */

import { wishlistRepository } from '@/core/repositories';
import { logger } from '@/core/logger/logger';
import { AuthError } from '@/core/errors';

class WishlistService {
  /**
   * Get user's wishlist
   */
  async getWishlist(userId) {
    if (!userId) {
      throw new AuthError('User must be authenticated');
    }

    try {
      logger.info('Getting wishlist for user:', userId);
      return await wishlistRepository.getUserWishlist(userId);
    } catch (error) {
      logger.error('Error getting wishlist:', error);
      throw error;
    }
  }

  /**
   * Add country to wishlist
   */
  async addToWishlist(userId, countryCode, countryName, notes = null) {
    if (!userId) {
      throw new AuthError('User must be authenticated');
    }

    try {
      logger.info('Adding to wishlist:', { userId, countryCode });
      return await wishlistRepository.addToWishlist(userId, countryCode, countryName, notes);
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
      throw new AuthError('User must be authenticated');
    }

    try {
      logger.info('Removing from wishlist:', { userId, id });
      return await wishlistRepository.removeFromWishlist(userId, id);
    } catch (error) {
      logger.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  /**
   * Toggle wishlist status
   */
  async toggleWishlist(userId, countryCode, countryName) {
    if (!userId) {
      throw new AuthError('User must be authenticated');
    }

    try {
      const existing = await wishlistRepository.getByCountryCode(userId, countryCode);
      
      if (existing) {
        await wishlistRepository.removeFromWishlist(userId, existing.id);
        return { added: false };
      } else {
        await wishlistRepository.addToWishlist(userId, countryCode, countryName);
        return { added: true };
      }
    } catch (error) {
      logger.error('Error toggling wishlist:', error);
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
      return await wishlistRepository.isInWishlist(userId, countryCode);
    } catch (error) {
      logger.error('Error checking wishlist:', error);
      return false;
    }
  }

  /**
   * Update wishlist notes
   */
  async updateNotes(userId, id, notes) {
    if (!userId) {
      throw new AuthError('User must be authenticated');
    }

    try {
      logger.info('Updating wishlist notes:', { userId, id });
      return await wishlistRepository.updateNotes(userId, id, notes);
    } catch (error) {
      logger.error('Error updating notes:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();
export default WishlistService;
