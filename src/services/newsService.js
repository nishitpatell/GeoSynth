/**
 * News Service
 * Handles news data fetching using NewsAPI
 */

class NewsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
  }

  /**
   * Get country-specific news
   */
  async getCountryNews(countryName, limit = 5) {
    try {
      const query = encodeURIComponent(countryName);
      const url = `${this.baseUrl}/everything?q=${query}&sortBy=publishedAt&pageSize=${limit}&apiKey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
        })),
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error('Error fetching country news:', error);
      return {
        articles: [],
        totalResults: 0,
        error: error.message,
      };
    }
  }

  /**
   * Get top headlines for a country
   */
  async getTopHeadlines(countryCode, limit = 10) {
    try {
      const url = `${this.baseUrl}/top-headlines?country=${countryCode.toLowerCase()}&pageSize=${limit}&apiKey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
        })),
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      return {
        articles: [],
        totalResults: 0,
        error: error.message,
      };
    }
  }

  /**
   * Search news by topic for a country
   */
  async searchNews(query, countryName, limit = 5) {
    try {
      const searchQuery = encodeURIComponent(`${query} ${countryName}`);
      const url = `${this.baseUrl}/everything?q=${searchQuery}&sortBy=relevancy&pageSize=${limit}&apiKey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        articles: data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
        })),
        totalResults: data.totalResults,
      };
    } catch (error) {
      console.error('Error searching news:', error);
      return {
        articles: [],
        totalResults: 0,
        error: error.message,
      };
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

// Export singleton instance
export const newsService = new NewsService();
export default NewsService;
