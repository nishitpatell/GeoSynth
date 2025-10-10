/**
 * World Bank API Service
 * https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
 */

import HttpClient from '../client/httpClient';
import { API_ENDPOINTS } from '@/config/api.config';
import { logger } from '@/core/logger/logger';

class WorldBankApi {
  constructor() {
    this.client = new HttpClient(API_ENDPOINTS.worldBank.baseUrl);
  }

  /**
   * Get economic indicators for a country
   */
  async getEconomicIndicators(countryCode) {
    try {
      const indicators = {
        gdp: 'NY.GDP.MKTP.CD', // GDP (current US$)
        gdpGrowth: 'NY.GDP.MKTP.KD.ZG', // GDP growth (annual %)
        gdpPerCapita: 'NY.GDP.PCAP.CD', // GDP per capita (current US$)
        inflation: 'FP.CPI.TOTL.ZG', // Inflation, consumer prices (annual %)
        unemployment: 'SL.UEM.TOTL.ZS', // Unemployment, total (% of total labor force)
        lifeExpectancy: 'SP.DYN.LE00.IN', // Life expectancy at birth, total (years)
        literacyRate: 'SE.ADT.LITR.ZS', // Literacy rate, adult total (% of people ages 15 and above)
      };

      const data = await Promise.all(
        Object.entries(indicators).map(async ([key, indicator]) => {
          try {
            const result = await this._getIndicator(countryCode, indicator);
            return [key, result];
          } catch (error) {
            logger.warn(`Failed to fetch ${key} for ${countryCode}:`, error);
            return [key, null];
          }
        })
      );

      return Object.fromEntries(data);
    } catch (error) {
      logger.error(`Error fetching economic indicators for ${countryCode}:`, error);
      throw error;
    }
  }

  /**
   * Get specific indicator
   */
  async _getIndicator(countryCode, indicatorCode) {
    try {
      const endpoint = API_ENDPOINTS.worldBank.endpoints.indicators
        .replace(':code', countryCode)
        .replace(':indicator', indicatorCode);
      
      const url = `${endpoint}?format=json&date=2020:2023&per_page=5`;
      const data = await this.client.get(url);

      if (!data || !Array.isArray(data) || data.length < 2) {
        return null;
      }

      const values = data[1];
      if (!values || values.length === 0) {
        return null;
      }

      // Get most recent value
      const mostRecent = values.find(v => v.value !== null);
      
      return {
        value: mostRecent?.value || null,
        year: mostRecent?.date || null,
        indicator: mostRecent?.indicator?.value || null,
      };
    } catch (error) {
      logger.warn(`Error fetching indicator ${indicatorCode}:`, error);
      return null;
    }
  }

  /**
   * Get country basic info from World Bank
   */
  async getCountryInfo(countryCode) {
    try {
      const endpoint = `${API_ENDPOINTS.worldBank.endpoints.countries}/${countryCode}?format=json`;
      const data = await this.client.get(endpoint);

      if (!data || !Array.isArray(data) || data.length < 2) {
        return null;
      }

      const country = data[1]?.[0];
      if (!country) return null;

      return {
        code: country.id,
        name: country.name,
        region: country.region?.value,
        incomeLevel: country.incomeLevel?.value,
        capitalCity: country.capitalCity,
        longitude: country.longitude,
        latitude: country.latitude,
      };
    } catch (error) {
      logger.error(`Error fetching country info for ${countryCode}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const worldBankApi = new WorldBankApi();
export default WorldBankApi;
