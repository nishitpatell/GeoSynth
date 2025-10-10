/**
 * Cache Manager
 * Handles caching with multiple strategies
 */

import { APP_CONFIG } from '@/config/app.config';
import { logger } from '@/core/logger/logger';

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.ttl = APP_CONFIG.cache.ttl;
    this.maxSize = APP_CONFIG.cache.maxSize;
  }

  /**
   * Generate cache key
   */
  _generateKey(prefix, identifier) {
    return `${prefix}_${identifier}`;
  }

  /**
   * Check if cache entry is expired
   */
  _isExpired(entry) {
    if (!entry.expiresAt) return false;
    return Date.now() > entry.expiresAt;
  }

  /**
   * Clean expired entries
   */
  _cleanExpired() {
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this._isExpired(entry)) {
        this.memoryCache.delete(key);
        logger.debug(`Cache entry expired: ${key}`);
      }
    }
  }

  /**
   * Enforce max size
   */
  _enforceMaxSize() {
    if (this.memoryCache.size <= this.maxSize) return;

    // Remove oldest entries (FIFO)
    const entriesToRemove = this.memoryCache.size - this.maxSize;
    const keys = Array.from(this.memoryCache.keys());
    
    for (let i = 0; i < entriesToRemove; i++) {
      this.memoryCache.delete(keys[i]);
      logger.debug(`Cache entry removed (max size): ${keys[i]}`);
    }
  }

  /**
   * Get from cache
   */
  get(key) {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    if (this._isExpired(entry)) {
      this.memoryCache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return entry.data;
  }

  /**
   * Set cache entry
   */
  set(key, data, ttl = this.ttl) {
    const entry = {
      data,
      createdAt: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : null,
    };

    this.memoryCache.set(key, entry);
    logger.debug(`Cache set: ${key}`);

    // Clean up
    this._enforceMaxSize();
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    const deleted = this.memoryCache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.memoryCache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Clear cache by prefix
   */
  clearByPrefix(prefix) {
    let count = 0;
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
        count++;
      }
    }
    logger.info(`Cleared ${count} cache entries with prefix: ${prefix}`);
  }

  /**
   * Get or set pattern
   */
  async getOrSet(key, fetchFn, ttl = this.ttl) {
    // Try to get from cache
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      logger.error(`Error in getOrSet for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    this._cleanExpired();
    
    return {
      size: this.memoryCache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.memoryCache.keys()),
    };
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
export default CacheManager;
