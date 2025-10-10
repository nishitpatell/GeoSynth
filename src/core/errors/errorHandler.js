/**
 * Global Error Handler
 */

import { toast } from 'sonner';
import { logger } from '../logger/logger';
import { AppError, ApiError, AuthError, NetworkError } from './AppError';
import { ERROR_MESSAGES } from '@/shared/constants';

/**
 * Handle error and show appropriate message
 */
export const handleError = (error, showToast = true) => {
  // Log error
  logger.error('Error occurred:', error);

  let message = ERROR_MESSAGES.SERVER_ERROR;
  let shouldRedirect = false;

  // Determine error type and message
  if (error instanceof AuthError) {
    message = error.message || ERROR_MESSAGES.AUTH_REQUIRED;
    shouldRedirect = true;
  } else if (error instanceof ApiError) {
    message = error.message || ERROR_MESSAGES.SERVER_ERROR;
  } else if (error instanceof NetworkError) {
    message = ERROR_MESSAGES.NETWORK_ERROR;
  } else if (error instanceof AppError) {
    message = error.message;
  } else if (error?.message) {
    message = error.message;
  }

  // Show toast notification
  if (showToast) {
    toast.error(message);
  }

  // Handle auth redirect
  if (shouldRedirect && typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = '/auth';
    }, 1500);
  }

  return {
    message,
    statusCode: error?.statusCode || 500,
    shouldRedirect,
  };
};

/**
 * Parse API error response
 */
export const parseApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    return new ApiError(
      data?.message || ERROR_MESSAGES.SERVER_ERROR,
      status,
      error.config?.url
    );
  } else if (error.request) {
    // Request made but no response
    return new NetworkError();
  } else {
    // Error in request setup
    return new AppError(error.message);
  }
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };
};

/**
 * Error boundary fallback
 */
export const getErrorBoundaryFallback = (error) => {
  logger.error('Error Boundary caught:', error);
  
  return {
    title: 'Something went wrong',
    message: error?.message || 'An unexpected error occurred',
    action: 'Reload Page',
  };
};
