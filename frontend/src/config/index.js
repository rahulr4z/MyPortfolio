/**
 * Application configuration
 * Centralized configuration management for the frontend
 */

const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'adminToken',
    refreshInterval: 5 * 60 * 1000, // 5 minutes
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
    mockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,
  },

  // Mock Data for when backend is not available
  mockData: {
    hero: {
      id: 1,
      title: "Hi, I'm Rahul",
      subtitle: "Product Manager & Developer",
      description: "Passionate about creating innovative solutions that make a difference. I combine strategic thinking with technical expertise to build products that users love.",
      image_url: null,
      cta_text: "Get In Touch",
      cta_link: "#contact"
    },
    about: [
      {
        id: 1,
        title: "Who I Am",
        subtitle: "Passionate Product Manager",
        description: "I'm a results-driven product manager with a passion for creating user-centric solutions that drive business growth and user satisfaction.",
        order_index: 0
      },
      {
        id: 2,
        title: "What I Do",
        subtitle: "Strategic Product Development",
        description: "I lead cross-functional teams to develop and launch successful products, from ideation to market launch and beyond.",
        order_index: 1
      },
      {
        id: 3,
        title: "What Interests Me",
        subtitle: "Innovation & Technology",
        description: "I'm fascinated by emerging technologies and their potential to solve real-world problems and improve people's lives.",
        order_index: 2
      }
    ],
    experiences: [
      {
        id: 1,
        title: "Senior Product Manager",
        company: "Tech Company",
        location: "San Francisco, CA",
        start_date: "2022-01",
        end_date: null,
        current: true,
        description: "Leading product strategy and development for enterprise SaaS solutions.",
        order_index: 0
      },
      {
        id: 2,
        title: "Product Manager",
        company: "Startup Inc",
        location: "New York, NY",
        start_date: "2020-03",
        end_date: "2021-12",
        current: false,
        description: "Managed product lifecycle and user experience for mobile applications.",
        order_index: 1
      }
    ],
    stats: [
      { id: 1, label: "Years Experience", value: "5+", order_index: 0 },
      { id: 2, label: "Projects Completed", value: "50+", order_index: 1 },
      { id: 3, label: "Happy Clients", value: "100+", order_index: 2 },
      { id: 4, label: "Awards Won", value: "10+", order_index: 3 }
    ],
    projects: [
      {
        id: 1,
        title: "E-commerce Platform",
        description: "A modern e-commerce solution with advanced features and analytics.",
        image_url: null,
        link: "#",
        category: "Web Development",
        order_index: 0
      },
      {
        id: 2,
        title: "Mobile App",
        description: "Cross-platform mobile application for task management.",
        image_url: null,
        link: "#",
        category: "Mobile Development",
        order_index: 1
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "John Doe",
        role: "CEO, TechCorp",
        content: "Rahul is an exceptional product manager who consistently delivers outstanding results.",
        avatar_url: null,
        order_index: 0
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "CTO, StartupXYZ",
        content: "Working with Rahul was a game-changer for our product development process.",
        avatar_url: null,
        order_index: 1
      }
    ],
    contact: {
      email: "rahul@example.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/rahul",
      github: "https://github.com/rahul"
    }
  }
};

// Environment-specific overrides
if (import.meta.env.PROD) {
  // In production, if no API URL is provided, we'll use mock data
  if (!import.meta.env.VITE_API_BASE_URL) {
    config.development.mockData = true;
    config.api.baseURL = 'http://localhost:8000'; // Fallback URL for validation
  } else {
    config.api.baseURL = import.meta.env.VITE_API_BASE_URL;
  }
  config.features.analytics = true;
  config.development.debug = false;
  config.development.logLevel = 'error';
}

// Validation - only validate if we're not using mock data
const validateConfig = () => {
  // If we're using mock data, skip API validation
  if (config.development.mockData) {
    console.log('Using mock data mode - skipping API configuration validation');
    return;
  }

  const required = ['api.baseURL'];
  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    return value === undefined || value === null || value === '';
  });
  
  if (missing.length > 0) {
    console.error('Missing required configuration:', missing);
    // Instead of throwing an error, enable mock data mode
    console.warn('Enabling mock data mode due to missing configuration');
    config.development.mockData = true;
  }
};

// Validate configuration on import
validateConfig();

export default config; 