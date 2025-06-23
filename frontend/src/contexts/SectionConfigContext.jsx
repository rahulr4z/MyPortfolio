import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSectionConfig } from '../services/api';
import { connectWebSocket, disconnectWebSocket, addWebSocketListener, getWebSocketStatus, testWebSocket } from '../services/api';

const SectionConfigContext = createContext();

// Use localStorage events for cross-tab communication (more reliable than custom events)
const CONFIG_UPDATE_KEY = 'sectionConfigUpdate';

export const useSectionConfig = () => {
  const context = useContext(SectionConfigContext);
  if (!context) {
    throw new Error('useSectionConfig must be used within a SectionConfigProvider');
  }
  return context;
};

// Default configuration to prevent crashes
const defaultConfig = {
  hero: { 
    title: "I Am Rahul Raj", 
    subtitle: "AVP Product",
    description: "Software Alchemist crafting digital experiences that users love & businesses value",
    badge: "Welcome to My Universe",
    badgeEmoji: "✨"
  },
  about: { 
    title: "Get to Know Me", 
    description: "A glimpse into my world of innovation and creativity",
    whoIAm: {
      title: "Who I Am",
      description: "Product manager with designer's heart, diplomat's tongue & engineer's brain"
    },
    whatIDo: {
      title: "What I Do",
      description: "Craft digital experiences that users love & businesses value"
    },
    whatInterestsMe: {
      title: "What Interests Me",
      description: "Emerging tech, AI possibilities & real-world impact solutions"
    }
  },
  experience: { 
    title: "My Journey", 
    mainTitle: "My Adventure So Far", 
    description: "A colorful journey through the world of product management and innovation! 🌈" 
  },
  projects: { 
    title: "My Creations", 
    mainTitle: "Amazing Projects", 
    description: "Check out some of my favorite projects and creations! 🚀" 
  },
  stats: { 
    title: "My Journey", 
    mainTitle: "Achievements & Skills", 
    description: "A glimpse into my professional journey and expertise" 
  },
  testimonials: { 
    title: "What People Say", 
    mainTitle: "Lovely Testimonials", 
    description: "Hear what amazing people have to say about working with me! 💬" 
  },
  contact: { 
    title: "Get In Touch", 
    mainTitle: "Let's Connect", 
    description: "Ready to work together? Let's create something amazing! 🚀" 
  },
  awards: {
    title: "Awards",
    description: "My awards and recognition"
  },
  education: {
    title: "Education",
    description: "My educational background"
  },
  certifications: {
    title: "Certifications",
    description: "My certifications"
  },
  skills: {
    title: "Skills",
    description: "My technical skills"
  },
  thankYou: {
    title: "Thank You",
    mainTitle: "Thanks for Visiting!",
    description: "I appreciate you taking the time to explore my portfolio. If you enjoyed what you saw or want to collaborate, let's connect!"
  }
};

export const SectionConfigProvider = ({ children }) => {
  console.log('SectionConfigProvider rendering...');
  
  const [sectionConfig, setSectionConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSectionConfig = async () => {
    console.log('🔄 Fetching section config from API...');
    try {
      setLoading(true);
      setError(null);
      const response = await getSectionConfig();
      console.log('📦 Section config API response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Response keys:', response ? Object.keys(response) : 'No response');
      
      if (response && response.config) {
        console.log('✅ Using response.config:', response.config);
        console.log('✅ Hero config from API:', response.config.hero);
        setSectionConfig(response.config);
      } else if (response) {
        console.log('✅ Using direct response:', response);
        console.log('✅ Hero config from direct response:', response.hero);
        setSectionConfig(response);
      } else {
        console.log('⚠️ No response, using default config');
        // Use default configuration if no response
        setSectionConfig(defaultConfig);
      }
    } catch (err) {
      console.error('❌ Error fetching section config:', err);
      // Use default configuration on error
      setSectionConfig(defaultConfig);
      setError(err.message || 'Failed to load section configuration');
    } finally {
      setLoading(false);
      console.log('✅ Section config fetch completed');
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSectionConfig();

    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (e) => {
      if (e.key === CONFIG_UPDATE_KEY && e.newValue) {
        console.log('📨 Config update detected via localStorage, refreshing...');
        console.log('🔄 Starting config refresh process...');
        fetchSectionConfig();
      }
    };

    // Listen for custom events in the current tab
    const handleCustomEvent = (e) => {
      console.log('📨 Config update detected via custom event, refreshing...');
      console.log('🔄 Starting config refresh process...');
      fetchSectionConfig();
    };

    // Listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (works in current tab)
    window.addEventListener('sectionConfigUpdated', handleCustomEvent);

    // Connect to WebSocket for real-time updates (optional)
    try {
      console.log('🔌 Attempting WebSocket connection for real-time updates...');
      connectWebSocket();

      // Set up WebSocket listener for section config updates
      const handleWebSocketMessage = (data) => {
        console.log('📨 WebSocket message received:', data);
        console.log('📨 Message type:', data.type);
        
        if (data.type === 'section_config_updated') {
          console.log('✅ Section config updated via WebSocket, refreshing...');
          console.log('📨 WebSocket update message:', data);
          fetchSectionConfig();
        } else if (data.type === 'test') {
          console.log('🧪 Test WebSocket message received:', data);
        } else {
          console.log('ℹ️ WebSocket message received but not a config update:', data);
        }
      };

      const removeListener = addWebSocketListener(handleWebSocketMessage);
      console.log('✅ WebSocket listener added successfully');

      // Test WebSocket connection by sending a test message
      setTimeout(async () => {
        console.log('🧪 Testing WebSocket connection...');
        const status = getWebSocketStatus();
        console.log('📊 WebSocket status:', status);
        
        if (status.connected) {
          console.log('✅ WebSocket is connected and ready');
          // Test the connection by sending a test message
          try {
            await testWebSocket();
            console.log('✅ WebSocket test message sent successfully');
          } catch (error) {
            console.log('⚠️ WebSocket test failed:', error);
          }
        } else {
          console.log('⚠️ WebSocket connection not ready:', status);
        }
      }, 2000);

      // Cleanup on unmount
      return () => {
        console.log('🧹 Cleaning up WebSocket and event listeners...');
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('sectionConfigUpdated', handleCustomEvent);
        removeListener();
        disconnectWebSocket();
      };
    } catch (err) {
      console.warn('⚠️ WebSocket connection failed, continuing without real-time updates:', err);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('sectionConfigUpdated', handleCustomEvent);
      };
    }
  }, []);

  const refreshConfig = async () => {
    await fetchSectionConfig();
  };

  const value = {
    sectionConfig,
    loading,
    error,
    refreshConfig
  };

  return (
    <SectionConfigContext.Provider value={value}>
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading portfolio configuration...
        </div>
      ) : (
        children
      )}
    </SectionConfigContext.Provider>
  );
};

// Global function to trigger config refresh across all instances
export const triggerConfigRefresh = () => {
  console.log('🔄 Triggering global config refresh...');
  console.log('📡 Dispatching config update via localStorage...');
  
  // Use localStorage to trigger updates across all tabs/windows
  const timestamp = Date.now();
  localStorage.setItem(CONFIG_UPDATE_KEY, timestamp.toString());
  
  // Also dispatch a custom event for the current tab
  window.dispatchEvent(new CustomEvent('sectionConfigUpdated', { detail: { timestamp } }));
  
  console.log('✅ Config refresh event dispatched successfully');
};

// Manual refresh function for testing
export const manualRefresh = () => {
  console.log('🔄 Manual refresh triggered...');
  triggerConfigRefresh();
};

// Expose functions globally for testing (development only)
if (process.env.NODE_ENV === 'development') {
  window.manualRefresh = manualRefresh;
  window.triggerConfigRefresh = triggerConfigRefresh;
} 