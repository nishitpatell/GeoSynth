/**
 * Country Repository
 * Data access layer for country information
 */

import { restCountriesApi } from '../api/services/restCountriesApi';
import { worldBankApi } from '../api/services/worldBankApi';
import { cacheManager } from '../cache/cacheManager';
import { logger } from '../logger/logger';
import { QUERY_KEYS } from '@/shared/constants';

class CountryRepository {
  constructor() {
    this.cachePrefix = QUERY_KEYS.COUNTRY;
  }

  /**
   * Get all countries
   */
  async getAllCountries() {
    const cacheKey = `${this.cachePrefix}_all`;
    
    return cacheManager.getOrSet(cacheKey, async () => {
      logger.info('Fetching all countries from API');
      return await restCountriesApi.getAllCountries();
    });
  }

  /**
   * Get country by code with full details
   */
  async getCountryByCode(code) {
    const cacheKey = `${this.cachePrefix}_${code}`;
    
    return cacheManager.getOrSet(cacheKey, async () => {
      logger.info(`Fetching country ${code} from API`);
      
      // Fetch from REST Countries API
      const basicInfo = await restCountriesApi.getCountryByCode(code);
      
      // Fetch economic data from World Bank (optional, non-blocking)
      let economicData = null;
      try {
        economicData = await worldBankApi.getEconomicIndicators(code);
      } catch (error) {
        logger.warn(`Failed to fetch economic data for ${code}:`, error);
      }

      return {
        ...basicInfo,
        economic: economicData,
      };
    });
  }

  /**
   * Search countries by name
   */
  async searchCountries(query) {
    if (!query || query.length < 2) {
      return [];
    }

    const cacheKey = `${this.cachePrefix}_search_${query.toLowerCase()}`;
    
    return cacheManager.getOrSet(cacheKey, async () => {
      logger.info(`Searching countries with query: ${query}`);
      return await restCountriesApi.searchCountriesByName(query);
    }, 1000 * 60 * 5); // 5 minutes cache for searches
  }

  /**
   * Get countries by region
   */
  async getCountriesByRegion(region) {
    const cacheKey = `${this.cachePrefix}_region_${region}`;
    
    return cacheManager.getOrSet(cacheKey, async () => {
      logger.info(`Fetching countries in region: ${region}`);
      return await restCountriesApi.getCountriesByRegion(region);
    });
  }

  /**
   * Get country economic indicators
   */
  async getCountryEconomics(code) {
    const cacheKey = `${this.cachePrefix}_economics_${code}`;
    
    return cacheManager.getOrSet(cacheKey, async () => {
      logger.info(`Fetching economic data for ${code}`);
      return await worldBankApi.getEconomicIndicators(code);
    });
  }

  /**
   * Clear country cache
   */
  clearCache(code = null) {
    if (code) {
      cacheManager.delete(`${this.cachePrefix}_${code}`);
    } else {
      cacheManager.clearByPrefix(this.cachePrefix);
    }
  }
}

// Export singleton instance
export const countryRepository = new CountryRepository();
export default CountryRepository;
