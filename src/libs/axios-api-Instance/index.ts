import axios, { AxiosError } from "axios";

import { baseApiUrl } from "../constants";

// Configuration object for axios instance
const config = {
  baseURL: baseApiUrl,
};

// Create an axios instance with the specified configuration
const api = axios.create(config);

/**
 * Interceptor for handling API responses
 * @param response - The successful response object
 * @returns The unmodified response
 */
api.interceptors.response.use(
  (response) => response,
  /**
   * Error handler for API responses
   * @param error - The AxiosError object
   * @throws The original error
   */
  (error: AxiosError) => {
    // message.error("Oops. Something failed. Please try again.");

    // Check for unauthorized access (401 status)
    if (error.response && error.response.status == 401) {
      // logout();
    }
    throw error;
  }
);

export const axiosApiInstance = api;
