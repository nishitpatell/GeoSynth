/**
 * REST Countries API Service
 * https://restcountries.com/
 */

import HttpClient from '../client/httpClient';
import { API_ENDPOINTS } from '@/config/api.config';
import { logger } from '@/core/logger/logger';

class RestCountriesApi {
  constructor() {
    this.client = new HttpClient(API_ENDPOINTS.restCountries.baseUrl);
  }

  /**
   * Get all countries
   */
  async getAllCountries() {
    try {
      const data = await this.client.get(API_ENDPOINTS.restCountries.endpoints.all);
      return this._normalizeCountries(data);
    } catch (error) {
      logger.error('Error fetching all countries:', error);
      throw error;
    }
  }

  /**
   * Get country by code
   */
  async getCountryByCode(code) {
    try {
      const endpoint = API_ENDPOINTS.restCountries.endpoints.byCode.replace(':code', code);
      const data = await this.client.get(endpoint);
      return this._normalizeCountry(data[0]);
    } catch (error) {
      logger.error(`Error fetching country ${code}:`, error);
      throw error;
    }
  }

  /**
   * Search countries by name
   */
  async searchCountriesByName(name) {
    try {
      const endpoint = API_ENDPOINTS.restCountries.endpoints.byName.replace(':name', name);
      const data = await this.client.get(endpoint);
      return this._normalizeCountries(data);
    } catch (error) {
      logger.error(`Error searching countries by name ${name}:`, error);
      throw error;
    }
  }

  /**
   * Get countries by region
   */
  async getCountriesByRegion(region) {
    try {
      const endpoint = API_ENDPOINTS.restCountries.endpoints.byRegion.replace(':region', region);
      const data = await this.client.get(endpoint);
      return this._normalizeCountries(data);
    } catch (error) {
      logger.error(`Error fetching countries by region ${region}:`, error);
      throw error;
    }
  }

  /**
   * Normalize single country data
   */
  _normalizeCountry(country) {
    if (!country) return null;

    return {
      code: country.cca2,
      code3: country.cca3,
      name: country.name.common,
      officialName: country.name.official,
      nativeName: country.name.nativeName
        ? Object.values(country.name.nativeName)[0]?.common
        : country.name.common,
      
      // Geographic
      capital: country.capital?.[0] || 'N/A',
      region: country.region,
      subregion: country.subregion,
      area: country.area,
      landlocked: country.landlocked,
      borders: country.borders || [],
      latlng: country.latlng,
      
      // Demographics
      population: country.population,
      languages: country.languages ? Object.values(country.languages) : [],
      
      // Economic
      currencies: country.currencies
        ? Object.entries(country.currencies).map(([code, data]) => ({
            code,
            name: data.name,
            symbol: data.symbol,
          }))
        : [],
      
      // Visual
      flag: country.flags.svg || country.flags.png,
      flagAlt: country.flags.alt,
      coatOfArms: country.coatOfArms?.svg || country.coatOfArms?.png,
      
      // Other
      timezones: country.timezones || [],
      continents: country.continents || [],
      tld: country.tld || [],
      callingCodes: country.idd
        ? [`${country.idd.root}${country.idd.suffixes?.[0] || ''}`]
        : [],
      independent: country.independent,
      unMember: country.unMember,
      
      // Maps
      maps: {
        google: country.maps?.googleMaps,
        openStreetMap: country.maps?.openStreetMaps,
      },
      
      // Raw data for advanced use
      _raw: country,
    };
  }

  /**
   * Normalize multiple countries
   */
  _normalizeCountries(countries) {
    if (!Array.isArray(countries)) return [];
    return countries.map(country => this._normalizeCountry(country));
  }
}

// Export singleton instance
export const restCountriesApi = new RestCountriesApi();
export default RestCountriesApi;
