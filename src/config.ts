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
// In production, use api.changebag.org if that's where the API is hosted
const apiDomain = isProduction ? 'https://api.changebag.org' : 'http://localhost:5000';

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  uploadsUrl: import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8085',
  isProduction
};

console.log('App config:', { 
  isProduction, 
  apiUrl: config.apiUrl, 
  uploadsUrl: config.uploadsUrl,
  hostname: window.location.hostname,
  apiDomain
});

export default config;
