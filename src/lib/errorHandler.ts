// Centralized error handling for frontend
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: any): string => {
  // Network errors
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  // API errors
  const status = error.response?.status;
  const message = error.response?.data?.message || 'An error occurred';

  switch (status) {
    case 400:
      return `Bad Request: ${message}`;
    case 401:
      return 'Unauthorized. Please sign in again.';
    case 403:
      return 'Access denied. You do not have permission.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. This resource already exists.';
    case 422:
      return `Validation Error: ${message}`;
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return message;
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};
