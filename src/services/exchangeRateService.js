/**
 * Exchange Rate Service
 * Handles currency exchange rate data
 */

class ExchangeRateService {
  constructor() {
    this.apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
    this.baseUrl = 'https://v6.exchangerate-api.com/v6';
  }

  /**
   * Get exchange rates for a base currency
   */
  async getExchangeRates(baseCurrency = 'USD') {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Exchange Rate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(data['error-type'] || 'Unknown API error');
      }
      
      return {
        baseCurrency: data.base_code,
        rates: data.conversion_rates,
        lastUpdated: data.time_last_update_utc,
        nextUpdate: data.time_next_update_utc,
      };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return {
        baseCurrency: baseCurrency,
        rates: {},
        error: error.message,
      };
    }
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Exchange Rate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(data['error-type'] || 'Unknown API error');
      }
      
      return {
        fromCurrency: data.base_code,
        toCurrency: data.target_code,
        exchangeRate: data.conversion_rate,
        originalAmount: amount,
        convertedAmount: data.conversion_result,
        lastUpdated: data.time_last_update_utc,
      };
    } catch (error) {
      console.error('Error converting currency:', error);
      return {
        fromCurrency,
        toCurrency,
        originalAmount: amount,
        convertedAmount: 0,
        error: error.message,
      };
    }
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies() {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/codes`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Exchange Rate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(data['error-type'] || 'Unknown API error');
      }
      
      return {
        currencies: data.supported_codes.map(([code, name]) => ({
          code,
          name,
        })),
      };
    } catch (error) {
      console.error('Error fetching supported currencies:', error);
      return {
        currencies: [],
        error: error.message,
      };
    }
  }

  /**
   * Get popular currency pairs for a country
   */
  getPopularPairs(countryCurrency) {
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
    return popularCurrencies.filter(currency => currency !== countryCurrency);
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount, currencyCode, locale = 'en-US') {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  }
}

// Export singleton instance
export const exchangeRateService = new ExchangeRateService();
export default ExchangeRateService;
