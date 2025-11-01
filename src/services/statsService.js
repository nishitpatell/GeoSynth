/**
 * Statistics Service
 * Fetches live statistics for the application
 */

import { supabase } from '@/integrations/supabase/client';

class StatsService {
  /**
   * Get total number of registered users
   */
  async getTotalUsers() {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching total users:', error);
      return 0;
    }
  }

  /**
   * Get total number of wishlists across all users
   */
  async getTotalWishlists() {
    try {
      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching total wishlists:', error);
      return 0;
    }
  }

  /**
   * Get all statistics at once
   */
  async getAllStats() {
    try {
      const [totalUsers, totalWishlists] = await Promise.all([
        this.getTotalUsers(),
        this.getTotalWishlists()
      ]);

      return {
        countries: 195, // Static count of countries
        activeUsers: totalUsers,
        totalWishlists: totalWishlists
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        countries: 195,
        activeUsers: 0,
        totalWishlists: 0
      };
    }
  }
}

export const statsService = new StatsService();
