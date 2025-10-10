/**
 * HTTP Client
 * Centralized HTTP request handler with interceptors
 */

import { logger } from '@/core/logger/logger';
import { parseApiError } from '@/core/errors';
import { APP_CONFIG } from '@/config/app.config';
import { retry } from '@/shared/utils';

class HttpClient {
  constructor(baseURL = '', config = {}) {
    this.baseURL = baseURL;
    this.config = {
      timeout: APP_CONFIG.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Apply request interceptors
   */
  async _applyRequestInterceptors(config) {
    let modifiedConfig = { ...config };
    
    for (const interceptor of this.interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    
    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  async _applyResponseInterceptors(response) {
    let modifiedResponse = response;
    
    for (const interceptor of this.interceptors.response) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    
    return modifiedResponse;
  }

  /**
   * Build full URL
   */
  _buildUrl(endpoint) {
    if (endpoint.startsWith('http')) return endpoint;
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Make HTTP request
   */
  async _request(method, endpoint, data = null, config = {}) {
    const url = this._buildUrl(endpoint);
    
    // Merge configs
    let requestConfig = {
      method,
      headers: { ...this.config.headers, ...config.headers },
      ...config,
    };

    // Add body for POST/PUT/PATCH
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestConfig.body = JSON.stringify(data);
    }

    // Apply request interceptors
    requestConfig = await this._applyRequestInterceptors(requestConfig);

    // Log request
    logger.apiRequest(method, url, data);

    try {
      // Make request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        requestConfig.timeout || this.config.timeout
      );

      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Check if response is ok
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: responseData,
          },
          config: requestConfig,
        };
      }

      // Apply response interceptors
      const finalResponse = await this._applyResponseInterceptors({
        data: responseData,
        status: response.status,
        headers: response.headers,
      });

      // Log response
      logger.apiResponse(method, url, response.status, finalResponse.data);

      return finalResponse.data;
    } catch (error) {
      // Log error
      logger.apiError(method, url, error);

      // Parse and throw error
      throw parseApiError(error);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, config = {}) {
    return this._request('GET', endpoint, null, config);
  }

  /**
   * POST request
   */
  async post(endpoint, data, config = {}) {
    return this._request('POST', endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put(endpoint, data, config = {}) {
    return this._request('PUT', endpoint, data, config);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, config = {}) {
    return this._request('PATCH', endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, config = {}) {
    return this._request('DELETE', endpoint, null, config);
  }

  /**
   * Request with retry
   */
  async requestWithRetry(method, endpoint, data = null, config = {}) {
    return retry(
      () => this._request(method, endpoint, data, config),
      APP_CONFIG.api.retries,
      APP_CONFIG.api.retryDelay
    );
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Export class for creating custom instances
export default HttpClient;
