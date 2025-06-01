/**
 * API utilities for making requests to the backend
 */
import config from '../config';

// Use config values for API domain to ensure consistency
const API_DOMAIN = config.apiUrl.endsWith('/api') 
  ? config.apiUrl.slice(0, -4) // Remove trailing /api if it exists
  : config.apiUrl;

/**
 * Constructs a full API URL based on the current environment
 * @param endpoint - The API endpoint (should start with /)
 * @returns The complete URL for the API endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  // Make sure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Get the base API URL without the trailing /api if it exists
  const baseUrl = config.apiUrl.endsWith('/api') 
    ? config.apiUrl.slice(0, -4) // Remove trailing /api
    : config.apiUrl;
  
  // Always use the full URL to ensure it works everywhere
  return `${baseUrl}/api${normalizedEndpoint}`;
};

/**
 * Constructs a full URL for uploaded files based on the current environment
 * @param filePath - The file path (should start with /)
 * @returns The complete URL for the uploaded file
 */
export const getUploadsUrl = (filePath: string): string => {
  // Make sure filePath starts with /
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  // Always use the full URL to ensure it works everywhere
  return `${API_DOMAIN}/uploads${normalizedPath}`;
};

/**
 * Determines if a URL is already absolute or needs to be prefixed
 * @param url - The URL to check
 * @returns The properly formatted URL
 */
export const getFullUrl = (url: string): string => {
  if (!url) return '';
  
  // If it already starts with http, it's already a full URL
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it starts with /uploads, use the uploads URL formatter
  if (url.startsWith('/uploads')) {
    return `${API_DOMAIN}${url}`;
  }
  
  // Otherwise, assume it's a relative path that needs the API domain
  return `${API_DOMAIN}${url}`;
};
