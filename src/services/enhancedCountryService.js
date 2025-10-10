/**
 * Enhanced Country Service
 * Integrates multiple APIs to provide comprehensive country data
 */

import { newsService } from './newsService.js';
import { weatherService } from './weatherService.js';
import { exchangeRateService } from './exchangeRateService.js';

class EnhancedCountryService {
  constructor() {
    this.restCountriesUrl = 'https://restcountries.com/v3.1';
    this.wikipediaUrl = 'https://en.wikipedia.org/api/rest_v1';
  }

  /**
   * Get comprehensive country data
   */
  async getCountryData(countryCode) {
    try {
      const [
        basicData,
        newsData,
        weatherData,
        exchangeData,
        wikiData
      ] = await Promise.allSettled([
        this.getBasicCountryData(countryCode),
        this.getCountryNews(countryCode),
        this.getCountryWeather(countryCode),
        this.getCountryExchangeRates(countryCode),
        this.getCountryWikipediaData(countryCode)
      ]);

      return {
        basic: basicData.status === 'fulfilled' ? basicData.value : null,
        news: newsData.status === 'fulfilled' ? newsData.value : { articles: [] },
        weather: weatherData.status === 'fulfilled' ? weatherData.value : null,
        exchange: exchangeData.status === 'fulfilled' ? exchangeData.value : null,
        wikipedia: wikiData.status === 'fulfilled' ? wikiData.value : null,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching comprehensive country data:', error);
      throw error;
    }
  }

  /**
   * Get basic country data from REST Countries API
   */
  async getBasicCountryData(countryCode) {
    try {
      const url = `${this.restCountriesUrl}/alpha/${countryCode}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`REST Countries API error: ${response.status}`);
      }
      
      const data = await response.json();
      const country = Array.isArray(data) ? data[0] : data;
      
      return {
        name: country.name.common,
        officialName: country.name.official,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        subregion: country.subregion,
        population: country.population,
        area: country.area,
        languages: country.languages ? Object.values(country.languages) : [],
        currencies: country.currencies ? Object.keys(country.currencies) : [],
        currencyDetails: country.currencies || {},
        timezones: country.timezones || [],
        borders: country.borders || [],
        flag: country.flags?.png || country.flags?.svg,
        coatOfArms: country.coatOfArms?.png || country.coatOfArms?.svg,
        maps: country.maps,
        latlng: country.latlng,
        landlocked: country.landlocked,
        independent: country.independent,
        unMember: country.unMember,
        continents: country.continents || [],
      };
    } catch (error) {
      console.error('Error fetching basic country data:', error);
      throw error;
    }
  }

  /**
   * Get country news
   */
  async getCountryNews(countryCode) {
    try {
      // First get country name for better news search
      const basicData = await this.getBasicCountryData(countryCode);
      return await newsService.getCountryNews(basicData.name, 10);
    } catch (error) {
      console.error('Error fetching country news:', error);
      return { articles: [], error: error.message };
    }
  }

  /**
   * Get country weather
   */
  async getCountryWeather(countryCode) {
    try {
      const basicData = await this.getBasicCountryData(countryCode);
      if (!basicData.capital || basicData.capital === 'N/A') {
        throw new Error('No capital city found');
      }
      
      return await weatherService.getCountryWeather(basicData.name, basicData.capital);
    } catch (error) {
      console.error('Error fetching country weather:', error);
      return { error: error.message };
    }
  }

  /**
   * Get country exchange rates
   */
  async getCountryExchangeRates(countryCode) {
    try {
      const basicData = await this.getBasicCountryData(countryCode);
      const currencies = basicData.currencies;
      
      if (!currencies || currencies.length === 0) {
        throw new Error('No currency information found');
      }
      
      const primaryCurrency = currencies[0];
      const rates = await exchangeRateService.getExchangeRates(primaryCurrency);
      
      return {
        primaryCurrency,
        currencyDetails: basicData.currencyDetails[primaryCurrency],
        rates: rates.rates,
        popularPairs: exchangeRateService.getPopularPairs(primaryCurrency),
        lastUpdated: rates.lastUpdated,
      };
    } catch (error) {
      console.error('Error fetching country exchange rates:', error);
      return { error: error.message };
    }
  }

  /**
   * Get country Wikipedia data
   */
  async getCountryWikipediaData(countryCode) {
    try {
      const basicData = await this.getBasicCountryData(countryCode);
      const countryName = basicData.name;
      
      // Search for the country page
      const searchUrl = `${this.wikipediaUrl}/page/summary/${encodeURIComponent(countryName)}`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Wikipedia API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail?.source,
        pageUrl: data.content_urls?.desktop?.page,
        coordinates: data.coordinates,
      };
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      return { error: error.message };
    }
  }

  /**
   * Get neighboring countries data
   */
  async getNeighboringCountries(countryCode) {
    try {
      const basicData = await this.getBasicCountryData(countryCode);
      
      if (!basicData.borders || basicData.borders.length === 0) {
        return [];
      }
      
      const neighbors = await Promise.allSettled(
        basicData.borders.map(borderCode => this.getBasicCountryData(borderCode))
      );
      
      return neighbors
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching neighboring countries:', error);
      return [];
    }
  }

  /**
   * Search countries with enhanced data
   */
  async searchCountries(query, limit = 10) {
    try {
      const url = `${this.restCountriesUrl}/name/${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`REST Countries API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.slice(0, limit).map(country => ({
        code: country.cca3,
        name: country.name.common,
        officialName: country.name.official,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        population: country.population,
        flag: country.flags?.png || country.flags?.svg,
      }));
    } catch (error) {
      console.error('Error searching countries:', error);
      return [];
    }
  }

  /**
   * Format large numbers
   */
  formatNumber(number) {
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  }

  /**
   * Format area
   */
  formatArea(area) {
    return `${this.formatNumber(area)} km²`;
  }
}

// Export singleton instance
export const enhancedCountryService = new EnhancedCountryService();
export default EnhancedCountryService;
