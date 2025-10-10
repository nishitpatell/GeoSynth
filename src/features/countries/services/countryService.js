/**
 * Country Service
 * Business logic for country operations
 */

import { countryRepository } from '@/core/repositories';
import { logger } from '@/core/logger/logger';

class CountryService {
  /**
   * Get all countries with optional filtering
   */
  async getAllCountries(filters = {}) {
    try {
      logger.info('Getting all countries');
      
      let countries = await countryRepository.getAllCountries();

      // Apply filters
      if (filters.region) {
        countries = countries.filter(c => c.region === filters.region);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        countries = countries.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.officialName.toLowerCase().includes(searchLower)
        );
      }

      return countries;
    } catch (error) {
      logger.error('Error getting all countries:', error);
      throw error;
    }
  }

  /**
   * Get country details by code
   */
  async getCountryByCode(code) {
    try {
      logger.info('Getting country:', code);
      return await countryRepository.getCountryByCode(code);
    } catch (error) {
      logger.error('Error getting country:', error);
      throw error;
    }
  }

  /**
   * Search countries
   */
  async searchCountries(query) {
    try {
      logger.info('Searching countries:', query);
      return await countryRepository.searchCountries(query);
    } catch (error) {
      logger.error('Error searching countries:', error);
      throw error;
    }
  }

  /**
   * Get countries by region
   */
  async getCountriesByRegion(region) {
    try {
      logger.info('Getting countries by region:', region);
      return await countryRepository.getCountriesByRegion(region);
    } catch (error) {
      logger.error('Error getting countries by region:', error);
      throw error;
    }
  }

  /**
   * Get country regions
   */
  async getRegions() {
    try {
      const countries = await countryRepository.getAllCountries();
      const regions = [...new Set(countries.map(c => c.region))].filter(Boolean);
      return regions.sort();
    } catch (error) {
      logger.error('Error getting regions:', error);
      throw error;
    }
  }

  /**
   * Get neighboring countries
   */
  async getNeighboringCountries(code) {
    try {
      const country = await countryRepository.getCountryByCode(code);
      
      if (!country.borders || country.borders.length === 0) {
        return [];
      }

      const neighbors = await Promise.all(
        country.borders.map(borderCode => 
          countryRepository.getCountryByCode(borderCode).catch(() => null)
        )
      );

      return neighbors.filter(Boolean);
    } catch (error) {
      logger.error('Error getting neighboring countries:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const countryService = new CountryService();
export default CountryService;
