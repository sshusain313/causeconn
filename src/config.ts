/**
 * Application configuration
 * Handles environment-specific settings
 */

interface Config {
  apiUrl: string;
  uploadsUrl: string;
  frontendUrl: string;
  isProduction: boolean;
}

// Determine if we're in production or development
// Check if we're running on changebag.org or localhost
const isProduction = import.meta.env.PROD || window.location.hostname === 'changebag.org' || window.location.hostname === 'www.changebag.org';

// Base domain for API requests
// In production, use api.changebag.org
const apiDomain = isProduction ? 'https://api.changebag.org' : 'http://localhost:5000';

const config: Config = {
  apiUrl: isProduction ? 'https://api.changebag.org' : (import.meta.env.VITE_API_URL || 'http://localhost:5000'),
  uploadsUrl: isProduction ? 'https://api.changebag.org/uploads' : (import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads'),
  frontendUrl: isProduction ? 'https://changebag.org' : 'http://localhost:8085',
  isProduction
};

// Helper function to get the full image URL
export function getFullImageUrl(path: string): string {
  // If the path is already an absolute URL, return it as-is
  if (/^(http|https):\/\//i.test(path)) {
    return path;
  }

  // Otherwise, assume it's a relative path and prepend the API URL
  return `${config.apiUrl}${path}`;
}

// Debug function to log API URL and uploads URL
export function debugConfig() {
  console.log('API URL:', config.apiUrl);
  console.log('Uploads URL:', config.uploadsUrl);
}

// Log the current configuration for debugging
console.log('App config:', { 
  isProduction, 
  apiUrl: config.apiUrl, 
  uploadsUrl: config.uploadsUrl,
  hostname: window.location.hostname,
  apiDomain
});

export default config;
