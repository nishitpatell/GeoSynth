/**
 * Weather Service
 * Handles weather data using Open-Meteo API (free, no API key required)
 */

class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1';
    this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';
  }

  /**
   * Get coordinates for a city/country
   */
  async getCoordinates(cityName, countryName) {
    try {
      const query = encodeURIComponent(`${cityName}, ${countryName}`);
      const url = `${this.geocodingUrl}/search?name=${query}&count=1&language=en&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('Location not found');
      }
      
      const location = data.results[0];
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country,
        timezone: location.timezone,
      };
    } catch (error) {
      console.error('Error getting coordinates:', error);
      throw error;
    }
  }

  /**
   * Get current weather for a location
   */
  async getCurrentWeather(latitude, longitude, timezone = 'auto') {
    try {
      const url = `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=${timezone}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        pressure: data.current.pressure_msl,
        cloudCover: data.current.cloud_cover,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day,
        time: data.current.time,
        units: data.current_units,
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return {
        error: error.message,
      };
    }
  }

  /**
   * Get weather forecast for a location
   */
  async getWeatherForecast(latitude, longitude, days = 7, timezone = 'auto') {
    try {
      const url = `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=${timezone}&forecast_days=${days}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        daily: data.daily.time.map((date, index) => ({
          date,
          weatherCode: data.daily.weather_code[index],
          temperatureMax: data.daily.temperature_2m_max[index],
          temperatureMin: data.daily.temperature_2m_min[index],
          apparentTemperatureMax: data.daily.apparent_temperature_max[index],
          apparentTemperatureMin: data.daily.apparent_temperature_min[index],
          sunrise: data.daily.sunrise[index],
          sunset: data.daily.sunset[index],
          uvIndex: data.daily.uv_index_max[index],
          precipitation: data.daily.precipitation_sum[index],
          precipitationProbability: data.daily.precipitation_probability_max[index],
          windSpeed: data.daily.wind_speed_10m_max[index],
          windDirection: data.daily.wind_direction_10m_dominant[index],
        })),
        units: data.daily_units,
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return {
        daily: [],
        error: error.message,
      };
    }
  }

  /**
   * Get weather for country capital
   */
  async getCountryWeather(countryName, capitalCity) {
    try {
      const coordinates = await this.getCoordinates(capitalCity, countryName);
      const currentWeather = await this.getCurrentWeather(
        coordinates.latitude,
        coordinates.longitude,
        coordinates.timezone
      );
      
      return {
        location: coordinates,
        current: currentWeather,
      };
    } catch (error) {
      console.error('Error fetching country weather:', error);
      return {
        error: error.message,
      };
    }
  }

  /**
   * Get weather description from weather code
   */
  getWeatherDescription(weatherCode, isDay = true) {
    const weatherCodes = {
      0: { description: 'Clear sky', icon: isDay ? '☀️' : '🌙' },
      1: { description: 'Mainly clear', icon: isDay ? '🌤️' : '🌙' },
      2: { description: 'Partly cloudy', icon: '⛅' },
      3: { description: 'Overcast', icon: '☁️' },
      45: { description: 'Fog', icon: '🌫️' },
      48: { description: 'Depositing rime fog', icon: '🌫️' },
      51: { description: 'Light drizzle', icon: '🌦️' },
      53: { description: 'Moderate drizzle', icon: '🌦️' },
      55: { description: 'Dense drizzle', icon: '🌧️' },
      61: { description: 'Slight rain', icon: '🌧️' },
      63: { description: 'Moderate rain', icon: '🌧️' },
      65: { description: 'Heavy rain', icon: '⛈️' },
      71: { description: 'Slight snow', icon: '🌨️' },
      73: { description: 'Moderate snow', icon: '❄️' },
      75: { description: 'Heavy snow', icon: '❄️' },
      95: { description: 'Thunderstorm', icon: '⛈️' },
    };

    return weatherCodes[weatherCode] || { description: 'Unknown', icon: '❓' };
  }

  /**
   * Format temperature
   */
  formatTemperature(temperature, unit = '°C') {
    return `${Math.round(temperature)}${unit}`;
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
export default WeatherService;
