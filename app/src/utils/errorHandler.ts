import { AxiosError } from 'axios';

interface ApiErrorResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Extracts a user-friendly error message from an API error
 * @param error - The error object from API call
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: any): string => {
  // Handle AxiosError
  if (error.response) {
    const data = error.response.data as ApiErrorResponse;

    // Priority: message > error > status text
    if (data?.message) {
      return data.message;
    }
    if (data?.error) {
      return data.error;
    }
    if (error.response.statusText) {
      return error.response.statusText;
    }

    // Fallback to status code message
    return `Request failed with status ${error.response.status}`;
  }

  // Handle network errors
  if (error.request) {
    return 'Network error. Please check your connection.';
  }

  // Handle other errors
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
