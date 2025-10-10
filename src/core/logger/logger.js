/**
 * Logger Service
 * Centralized logging with different levels
 */

import { ENV } from '@/config/env';

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor() {
    this.isDev = ENV.IS_DEV;
  }

  /**
   * Format log message
   */
  _formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      data: args.length > 0 ? args : undefined,
    };
  }

  /**
   * Log to console
   */
  _log(level, message, ...args) {
    if (!this.isDev && level === LOG_LEVELS.DEBUG) return;

    const formatted = this._formatMessage(level, message, ...args);
    
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(`[${formatted.timestamp}] ERROR:`, message, ...args);
        break;
      case LOG_LEVELS.WARN:
        console.warn(`[${formatted.timestamp}] WARN:`, message, ...args);
        break;
      case LOG_LEVELS.INFO:
        console.info(`[${formatted.timestamp}] INFO:`, message, ...args);
        break;
      case LOG_LEVELS.DEBUG:
        console.log(`[${formatted.timestamp}] DEBUG:`, message, ...args);
        break;
      default:
        console.log(`[${formatted.timestamp}]`, message, ...args);
    }

    // In production, you could send logs to a service like Sentry
    if (!this.isDev && level === LOG_LEVELS.ERROR) {
      this._sendToErrorTracking(formatted);
    }
  }

  /**
   * Send error to tracking service (placeholder)
   */
  _sendToErrorTracking(logData) {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(logData);
  }

  /**
   * Public logging methods
   */
  error(message, ...args) {
    this._log(LOG_LEVELS.ERROR, message, ...args);
  }

  warn(message, ...args) {
    this._log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this._log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this._log(LOG_LEVELS.DEBUG, message, ...args);
  }

  /**
   * Log API request
   */
  apiRequest(method, url, data) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  /**
   * Log API response
   */
  apiResponse(method, url, status, data) {
    this.debug(`API Response: ${method} ${url} - ${status}`, data);
  }

  /**
   * Log API error
   */
  apiError(method, url, error) {
    this.error(`API Error: ${method} ${url}`, error);
  }
}

// Export singleton instance
export const logger = new Logger();
