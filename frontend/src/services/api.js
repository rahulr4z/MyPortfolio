import config from '../config';

/**
 * API Service
 * Centralized API communication layer with error handling and retry logic
 */

// Check if backend is available
const isBackendAvailable = () => {
  return config.api.baseURL && config.api.baseURL !== 'null';
};

// Default data for when backend is not available
const getDefaultData = (endpoint) => {
  const defaults = {
    '/api/hero': {
      title: "I Am Rahul Raj",
      subtitle: "AVP Product",
      description: "Software Alchemist crafting digital experiences that users love & businesses value",
      badge: "Welcome to My Universe",
      badge_emoji: "✨",
      cta_text: "View My Work"
    },
    '/api/about': [
      {
        id: 1,
        title: "Who I Am",
        subtitle: "Passionate Product Manager",
        description: "A dedicated professional with a passion for creating innovative solutions that drive business growth and user satisfaction."
      },
      {
        id: 2,
        title: "What I Do",
        subtitle: "Product Strategy & Development",
        description: "I lead product development initiatives, from concept to launch, ensuring exceptional user experiences and measurable business outcomes."
      },
      {
        id: 3,
        title: "What Interests Me",
        subtitle: "Technology & Innovation",
        description: "I'm fascinated by emerging technologies, user behavior patterns, and the intersection of business strategy with technical innovation."
      }
    ],
    '/api/experiences': [
      {
        id: 1,
        title: "AVP Product",
        company: "Leading Tech Company",
        duration: "2022 - Present",
        description: "Leading product strategy and development for enterprise solutions."
      }
    ],
    '/api/projects': [
      {
        id: 1,
        title: "Portfolio Website",
        description: "A modern, responsive portfolio built with React and Node.js",
        technologies: ["React", "Node.js", "Tailwind CSS"],
        image_url: null,
        live_url: "#",
        github_url: "#"
      }
    ],
    '/api/stats': [
      { id: 1, label: "Years Experience", value: "5+", icon: "💼" },
      { id: 2, label: "Projects Completed", value: "50+", icon: "🚀" },
      { id: 3, label: "Happy Clients", value: "30+", icon: "😊" }
    ],
    '/api/testimonials': [
      {
        id: 1,
        name: "John Doe",
        role: "CEO",
        company: "Tech Corp",
        content: "Rahul is an exceptional product manager who consistently delivers outstanding results.",
        avatar_url: null
      }
    ],
    '/api/contact': [
      {
        id: 1,
        type: "email",
        value: "rahul@example.com",
        icon: "📧"
      },
      {
        id: 2,
        type: "phone",
        value: "+1 (555) 123-4567",
        icon: "📱"
      }
    ]
  };
  
  return defaults[endpoint] || null;
};

// WebSocket connection for real-time updates
let websocket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 1000; // 1 second

// WebSocket event listeners
const websocketListeners = new Set();

export const connectWebSocket = () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ WebSocket disabled - no backend available');
    return;
  }

  if (websocket && websocket.readyState === WebSocket.OPEN) {
    return; // Already connected
  }

  try {
    const wsUrl = config.api.baseURL.replace('http', 'ws') + '/ws';
    console.log('Attempting WebSocket connection to:', wsUrl);
    websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('✅ WebSocket connected successfully');
      reconnectAttempts = 0;
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket message received:', data);
        
        // Notify all listeners
        websocketListeners.forEach(listener => {
          try {
            listener(data);
          } catch (error) {
            console.error('Error in WebSocket listener:', error);
          }
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = (event) => {
      console.log('🔌 WebSocket disconnected:', event.code, event.reason);
      
      // Attempt to reconnect if not a normal closure
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`🔄 Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(connectWebSocket, reconnectDelay * reconnectAttempts);
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        console.log('❌ Max WebSocket reconnection attempts reached. Real-time updates disabled.');
      }
    };

    websocket.onerror = (error) => {
      console.warn('⚠️ WebSocket connection error (this is normal if backend WebSocket is not available):', error);
      // Don't throw error - WebSocket is optional for real-time updates
    };

  } catch (error) {
    console.warn('⚠️ Failed to create WebSocket connection (real-time updates disabled):', error);
    // Don't throw error - WebSocket is optional
  }
};

export const disconnectWebSocket = () => {
  if (websocket) {
    websocket.close(1000, 'Client disconnecting');
    websocket = null;
  }
};

export const addWebSocketListener = (listener) => {
  websocketListeners.add(listener);
  return () => websocketListeners.delete(listener);
};

export const removeWebSocketListener = (listener) => {
  websocketListeners.delete(listener);
};

// Get WebSocket status for debugging
export const getWebSocketStatus = () => {
  if (!websocket) {
    return { connected: false, readyState: null, error: 'WebSocket not initialized' };
  }
  return {
    connected: websocket.readyState === WebSocket.OPEN,
    readyState: websocket.readyState,
    readyStateText: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][websocket.readyState],
    url: websocket.url
  };
};

// Test WebSocket connection
export const testWebSocket = async () => {
  try {
    console.log('🧪 Testing WebSocket connection...');
    const response = await apiFetch('/api/test-websocket', {
      method: 'POST',
    });
    console.log('✅ Test message sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to test WebSocket:', error);
    throw error;
  }
};

// Expose WebSocket instance for testing (development only)
if (process.env.NODE_ENV === 'development') {
  window.websocket = websocket;
  window.getWebSocketStatus = getWebSocketStatus;
}

// Token management
const getAuthToken = () => {
  return localStorage.getItem(config.auth.tokenKey);
};

const setAuthToken = (token) => {
  localStorage.setItem(config.auth.tokenKey, token);
};

const removeAuthToken = () => {
  localStorage.removeItem(config.auth.tokenKey);
};

/**
 * Enhanced fetch wrapper with retry logic and better error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Object>} API response
 */
const apiFetch = async (url, options = {}, retries = config.api.retries) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);
      
      const response = await fetch(`${config.api.baseURL}${url}`, {
        ...finalOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // Handle server errors
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Handle client errors
      if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed: ${response.status}`);
      }
      
      // Handle successful responses
      if (response.status === 204) {
        return null; // No content
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * config.api.retryDelay)
      );
    }
  }
};

/**
 * Health check with enhanced error handling
 * @returns {Promise<Object>} Health status
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiFetch('/');
    return response;
  } catch (error) {
    console.error('Error checking backend health:', error);
    throw new Error('Backend is not available. Please check if the server is running.');
  }
};

/**
 * Contact form submission
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} Submission result
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

/**
 * About section API functions
 */
export const getAboutContent = async () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default about data');
    return getDefaultData('/api/about');
  }
  
  try {
    const response = await apiFetch('/api/about');
    return response;
  } catch (error) {
    console.error('Error fetching about:', error);
    // Return default data on error
    return getDefaultData('/api/about');
  }
};

export const updateAboutContent = async (id, aboutData) => {
  try {
    const response = await apiFetch(`/api/about/${id}`, {
      method: 'PUT',
      body: JSON.stringify(aboutData),
    });
    return response;
  } catch (error) {
    console.error('Error updating about content:', error);
    throw error;
  }
};

export const updateAboutOrder = async (orderData) => {
  try {
    const response = await apiFetch('/api/about/order', {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
    return response;
  } catch (error) {
    console.error('Error updating about order:', error);
    throw error;
  }
};

/**
 * Experience section API functions
 */
export const getExperiences = async () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default experiences data');
    return getDefaultData('/api/experiences');
  }
  
  try {
    const response = await apiFetch('/api/experiences');
    return response;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    // Return default data on error
    return getDefaultData('/api/experiences');
  }
};

export const updateExperience = async (id, experienceData) => {
  try {
    const response = await apiFetch(`/api/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(experienceData),
    });
    return response;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

/**
 * Stats section API functions
 */
export const getStats = async () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default stats data');
    return getDefaultData('/api/stats');
  }
  
  try {
    const response = await apiFetch('/api/stats');
    return response;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default data on error
    return getDefaultData('/api/stats');
  }
};

export const updateStat = async (id, statData) => {
  try {
    const response = await apiFetch(`/api/stats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statData),
    });
    return response;
  } catch (error) {
    console.error('Error updating stat:', error);
    throw error;
  }
};

/**
 * Testimonials section API functions
 */
export const getTestimonials = async () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default testimonials data');
    return getDefaultData('/api/testimonials');
  }
  
  try {
    const response = await apiFetch('/api/testimonials');
    return response;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Return default data on error
    return getDefaultData('/api/testimonials');
  }
};

export const updateTestimonial = async (id, testimonialData) => {
  try {
    const response = await apiFetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
    return response;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

/**
 * Projects section API functions
 */
export const getProjects = async (category = null) => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default projects data');
    return getDefaultData('/api/projects');
  }
  
  try {
    const url = category ? `/api/projects?category=${category}` : '/api/projects';
    const response = await apiFetch(url);
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return default data on error
    return getDefaultData('/api/projects');
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await apiFetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    return response;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Admin endpoints with enhanced error handling
 */
export const getAdminContacts = async () => {
  try {
    const response = await apiFetch('/api/admin/contacts');
    return response;
  } catch (error) {
    console.error('Error fetching admin contacts:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

export const getAdminAbout = async () => {
  try {
    const response = await apiFetch('/api/admin/about');
    return response;
  } catch (error) {
    console.error('Error fetching admin about:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

export const getAdminExperiences = async () => {
  try {
    const response = await apiFetch('/api/admin/experiences');
    return response;
  } catch (error) {
    console.error('Error fetching admin experiences:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

export const getAdminStats = async () => {
  try {
    const response = await apiFetch('/api/admin/stats');
    return response;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

export const getAdminTestimonials = async () => {
  try {
    const response = await apiFetch('/api/admin/testimonials');
    return response;
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

export const getAdminProjects = async () => {
  try {
    const response = await apiFetch('/api/admin/projects');
    return response;
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

/**
 * Create operations with enhanced error handling
 */
export const createAbout = async (aboutData) => {
  try {
    const response = await apiFetch('/api/about', {
      method: 'POST',
      body: JSON.stringify(aboutData),
    });
    return response;
  } catch (error) {
    console.error('Error creating about:', error);
    throw error;
  }
};

export const createExperience = async (experienceData) => {
  try {
    const response = await apiFetch('/api/experiences', {
      method: 'POST',
      body: JSON.stringify(experienceData),
    });
    return response;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

export const createStat = async (statData) => {
  try {
    const response = await apiFetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify(statData),
    });
    return response;
  } catch (error) {
    console.error('Error creating stat:', error);
    throw error;
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    const response = await apiFetch('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
    return response;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await apiFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Delete operations with enhanced error handling
 */
export const deleteTestimonial = async (id) => {
  try {
    await apiFetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

export const deleteExperience = async (id) => {
  try {
    await apiFetch(`/api/experiences/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

export const deleteStat = async (id) => {
  try {
    await apiFetch(`/api/stats/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting stat:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await apiFetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const deleteAbout = async (id) => {
  try {
    await apiFetch(`/api/about/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting about:', error);
    throw error;
  }
};

/**
 * Authentication with enhanced error handling
 */
export const login = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${config.api.baseURL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    setAuthToken(data.access_token);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  removeAuthToken();
};

/**
 * Contact info operations
 */
export const submitContact = async (formData) => {
  try {
    const response = await apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response;
  } catch (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
};

export const getContactInfo = async () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default contact data');
    return getDefaultData('/api/contact');
  }
  
  try {
    const response = await apiFetch('/api/contact-info');
    return response;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    // Return default data on error
    return getDefaultData('/api/contact');
  }
};

export const getAdminContactInfo = async () => {
  try {
    const response = await apiFetch('/api/admin/contact-info');
    return response;
  } catch (error) {
    console.error('Error fetching admin contact info:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

export const createContactInfo = async (contactData) => {
  try {
    const response = await apiFetch('/api/admin/contact-info', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
    return response;
  } catch (error) {
    console.error('Error creating contact info:', error);
    throw error;
  }
};

export const updateContactInfo = async (id, contactData) => {
  try {
    const response = await apiFetch(`/api/admin/contact-info/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
    return response;
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};

export const deleteContactInfo = async (id) => {
  try {
    await apiFetch(`/api/admin/contact-info/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting contact info:', error);
    throw error;
  }
};

/**
 * Hero section operations
 */
export const getHero = async () => {
  if (!isBackendAvailable()) {
    console.log('⚠️ Backend not available, returning default hero data');
    return getDefaultData('/api/hero');
  }
  
  try {
    const response = await apiFetch('/api/hero');
    return response;
  } catch (error) {
    console.error('Error fetching hero:', error);
    // Return default data on error
    return getDefaultData('/api/hero');
  }
};

export const updateHero = async (id, heroData) => {
  if (!isBackendAvailable()) {
    throw new Error('Backend not available - cannot update data');
  }
  
  try {
    const response = await apiFetch(`/api/hero/${id}`, {
      method: 'PUT',
      body: JSON.stringify(heroData),
    });
    return response;
  } catch (error) {
    console.error('Error updating hero:', error);
    throw error;
  }
};

export const createHero = async (heroData) => {
  if (!isBackendAvailable()) {
    throw new Error('Backend not available - cannot create data');
  }
  
  try {
    const response = await apiFetch('/api/hero', {
      method: 'POST',
      body: JSON.stringify(heroData),
    });
    return response;
  } catch (error) {
    console.error('Error creating hero:', error);
    throw error;
  }
};

export const getAdminHero = async () => {
  if (!isBackendAvailable()) {
    throw new Error('Backend not available - admin features disabled');
  }
  
  try {
    const response = await apiFetch('/api/admin/hero');
    return response;
  } catch (error) {
    console.error('Error fetching admin hero:', error);
    if (error.message.includes('Authentication failed')) {
      throw new Error('Please log in to access admin features.');
    }
    throw error;
  }
};

/**
 * Awards operations
 */
export const getAwards = async () => {
  try {
    const response = await apiFetch('/api/awards');
    return response;
  } catch (error) {
    console.error('Error fetching awards:', error);
    throw error;
  }
};

export const createAward = async (data) => {
  try {
    const response = await apiFetch('/api/awards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error creating award:', error);
    throw error;
  }
};

export const updateAward = async (id, data) => {
  try {
    const response = await apiFetch(`/api/awards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error updating award:', error);
    throw error;
  }
};

export const deleteAward = async (id) => {
  try {
    await apiFetch(`/api/awards/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting award:', error);
    throw error;
  }
};

/**
 * Education operations
 */
export const getEducation = async () => {
  try {
    const response = await apiFetch('/api/education');
    return response;
  } catch (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
};

export const createEducation = async (data) => {
  try {
    const response = await apiFetch('/api/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error creating education:', error);
    throw error;
  }
};

export const updateEducation = async (id, data) => {
  try {
    const response = await apiFetch(`/api/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

export const deleteEducation = async (id) => {
  try {
    await apiFetch(`/api/education/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

/**
 * Certifications operations
 */
export const getCertifications = async () => {
  try {
    const response = await apiFetch('/api/certifications');
    return response;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    throw error;
  }
};

export const createCertification = async (data) => {
  try {
    const response = await apiFetch('/api/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error creating certification:', error);
    throw error;
  }
};

export const updateCertification = async (id, data) => {
  try {
    const response = await apiFetch(`/api/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error updating certification:', error);
    throw error;
  }
};

export const deleteCertification = async (id) => {
  try {
    await apiFetch(`/api/certifications/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting certification:', error);
    throw error;
  }
};

/**
 * Skills operations
 */
export const getSkills = async () => {
  try {
    const response = await apiFetch('/api/skills');
    return response;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const createSkill = async (data) => {
  try {
    const response = await apiFetch('/api/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};

export const updateSkill = async (id, data) => {
  try {
    const response = await apiFetch(`/api/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

export const deleteSkill = async (id) => {
  try {
    await apiFetch(`/api/skills/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

/**
 * Section titles operations (new structure)
 */
export const getSectionTitles = async () => {
  try {
    const response = await apiFetch('/api/section-titles');
    return response;
  } catch (error) {
    console.error('Error fetching section titles:', error);
    throw error;
  }
};

export const getSectionTitle = async (sectionName) => {
  try {
    const response = await apiFetch(`/api/section-titles/${sectionName}`);
    return response;
  } catch (error) {
    console.error('Error fetching section title:', error);
    throw error;
  }
};

export const createSectionTitle = async (sectionTitleData) => {
  try {
    const response = await apiFetch('/api/section-titles', {
      method: 'POST',
      body: JSON.stringify(sectionTitleData),
    });
    return response;
  } catch (error) {
    console.error('Error creating section title:', error);
    throw error;
  }
};

export const updateSectionTitle = async (id, sectionTitleData) => {
  try {
    const response = await apiFetch(`/api/section-titles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionTitleData),
    });
    return response;
  } catch (error) {
    console.error('Error updating section title:', error);
    throw error;
  }
};

export const deleteSectionTitle = async (id) => {
  try {
    await apiFetch(`/api/section-titles/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting section title:', error);
    throw error;
  }
};

// Legacy section config functions (for backward compatibility)
export const getSectionConfig = async () => {
  try {
    // Convert section titles to the old format for backward compatibility
    const sectionTitles = await getSectionTitles();
    const config = {};
    
    sectionTitles.forEach(section => {
      config[section.section_name] = {
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        mainTitle: section.main_title,
        emoji: section.emoji
      };
    });
    
    return {
      id: 1,
      config: config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching section config (legacy):', error);
    throw error;
  }
};

export const updateSectionConfig = async (configData) => {
  try {
    console.log('🔄 updateSectionConfig called with:', configData);
    
    // Convert the old format to new section titles format
    const updates = [];
    
    for (const [sectionName, sectionData] of Object.entries(configData)) {
      // Find existing section title
      try {
        const existingSection = await getSectionTitle(sectionName);
        
        // Update existing section
        const updateData = {
          title: sectionData.title || existingSection.title,
          subtitle: sectionData.subtitle || existingSection.subtitle,
          description: sectionData.description || existingSection.description,
          main_title: sectionData.mainTitle || existingSection.main_title,
          emoji: sectionData.emoji || existingSection.emoji
        };
        
        await updateSectionTitle(existingSection.id, updateData);
        updates.push(sectionName);
      } catch (error) {
        // Section doesn't exist, create new one
        const createData = {
          section_name: sectionName,
          title: sectionData.title || '',
          subtitle: sectionData.subtitle || null,
          description: sectionData.description || null,
          main_title: sectionData.mainTitle || null,
          emoji: sectionData.emoji || null,
          is_active: true,
          order_index: 0
        };
        
        await createSectionTitle(createData);
        updates.push(sectionName);
      }
    }
    
    console.log('✅ Updated sections:', updates);
    return { message: 'Section config updated successfully', updated_sections: updates };
  } catch (error) {
    console.error('❌ updateSectionConfig error:', error);
    throw error;
  }
}; 