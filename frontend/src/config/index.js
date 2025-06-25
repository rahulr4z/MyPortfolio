/**
 * Application configuration
 * Centralized configuration management for the frontend
 */

const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://rahul-portfolio-backend.fly.dev',
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'adminToken',
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  },

  // Domain Configuration
  domain: {
    // Custom domain settings
    customDomain: import.meta.env.VITE_CUSTOM_DOMAIN || null,
    // API subdomain (if using subdomain for API)
    apiSubdomain: import.meta.env.VITE_API_SUBDOMAIN || 'api',
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      danger: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out',
    },
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 100,
    },
  },

  // Feature Flags
  features: {
    autoRefresh: true,
    optimisticUpdates: true,
    errorBoundary: true,
    analytics: false,
  },

  // Development Configuration
  development: {
    debug: import.meta.env.DEV,
    logLevel: import.meta.env.DEV ? 'debug' : 'error',
    mockData: false,
  },
};

// Environment-specific overrides
if (import.meta.env.PROD) {
  config.api.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://rahul-portfolio-backend.fly.dev';
  config.features.analytics = true;
  config.development.debug = false;
  config.development.logLevel = 'error';
}

// Validation
const validateConfig = () => {
  const required = ['api.baseURL'];
  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    return value === undefined || value === null || value === '';
  });
  
  if (missing.length > 0) {
    console.warn('Backend not configured yet. Please set VITE_API_BASE_URL environment variable.');
    console.warn('For now, using placeholder URL. Update this once your backend is deployed.');
    // Don't throw error, just warn
    return false;
  }
  return true;
};

// Validate configuration on import
validateConfig();

export default config; 