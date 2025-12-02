import React, { useState, useEffect } from 'react';
import { Save, Settings, Eye, Edit2, Loader2, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { getSectionConfig, updateSectionConfig, testWebSocket } from '../../services/api';
import { useSectionConfig, triggerConfigRefresh } from '../../contexts/SectionConfigContext';
import { addWebSocketListener } from '../../services/api';

const AdminSectionConfig = () => {
  const { refreshConfig, sectionConfig } = useSectionConfig();
  const [sections, setSections] = useState({
    hero: {
      title: "I Am Rahul Raj",
      subtitle: "AVP Product",
      description: "Software Alchemist crafting digital experiences that users love & businesses value",
      badge: "Welcome to My Universe",
      badgeEmoji: "✨"
    },
    about: {
      title: "Get to Know Me",
      mainTitle: "Get to Know Me",
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
    stats: {
      title: "My Journey",
      mainTitle: "Achievements & Skills",
      description: "A glimpse into my professional journey and expertise"
    },
    projects: {
      title: "My Creations",
      mainTitle: "Amazing Projects",
      description: "Check out some of my favorite projects and creations! 🚀"
    },
    experience: {
      title: "My Journey",
      mainTitle: "My Adventure So Far",
      description: "A colorful journey through the world of product management and innovation! 🌈"
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
    thankYou: {
      title: "Thank You",
      mainTitle: "Thanks for Reaching Out!",
      description: "I'll get back to you as soon as possible. In the meantime, feel free to explore more of my work!",
      emoji: "🎉"
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [realTimeStatus, setRealTimeStatus] = useState({ connected: false, lastUpdate: null });

  // Fetch section config on component mount
  useEffect(() => {
    const fetchSectionConfig = async () => {
      try {
        console.log('🔄 Fetching section config for admin panel...');
        const response = await getSectionConfig();
        console.log('📦 Section config response:', response);
        if (response.config) {
          console.log('✅ Setting sections with config data');
          setSections(response.config);
        } else if (response) {
          console.log('✅ Setting sections with direct response');
          setSections(response);
        } else {
          console.log('⚠️ No config data, using defaults');
        }
      } catch (error) {
        console.error('❌ Error fetching section config:', error);
        // Keep default values if fetch fails
      }
    };

    fetchSectionConfig();
  }, []);

  // Also update sections when sectionConfig from context changes
  useEffect(() => {
    if (sectionConfig && Object.keys(sectionConfig).length > 0) {
      console.log('🔄 Updating sections from context:', sectionConfig);
      setSections(sectionConfig);
    }
  }, [sectionConfig]);

  // Set up WebSocket listener for real-time updates
  useEffect(() => {
    console.log('🔌 Setting up WebSocket listener in admin panel...');
    
    const handleWebSocketMessage = (data) => {
      console.log('📨 Admin panel received WebSocket message:', data);
      console.log('📨 Message type:', data.type);
      
      if (data.type === 'section_config_updated') {
        console.log('✅ Section config updated via WebSocket in admin panel');
        setRealTimeStatus({
          connected: true,
          lastUpdate: new Date().toLocaleTimeString()
        });
        
        // Refresh the config data
        console.log('🔄 Refreshing config from WebSocket update...');
        refreshConfig().then(() => {
          console.log('✅ Config refreshed, updating local state...');
          // Update local state with new config
          getSectionConfig().then(response => {
            console.log('📦 New config from API:', response);
            if (response.config) {
              console.log('✅ Setting sections with new config');
              setSections(response.config);
            } else if (response) {
              console.log('✅ Setting sections with direct response');
              setSections(response);
            }
          });
        });
      } else {
        console.log('ℹ️ WebSocket message received but not a config update:', data);
      }
    };

    const removeListener = addWebSocketListener(handleWebSocketMessage);
    console.log('✅ WebSocket listener added to admin panel');

    // Set connected status
    setRealTimeStatus(prev => ({ ...prev, connected: true }));

    return () => {
      console.log('🧹 Cleaning up admin panel WebSocket listener...');
      removeListener();
    };
  }, [refreshConfig]);

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    console.log('📦 Current sections data:', sections);
    console.log('📦 Sections data type:', typeof sections);
    console.log('📦 Sections data keys:', Object.keys(sections));
    console.log('📦 Hero section data:', sections.hero);
    
    // Check authentication
    const token = localStorage.getItem('adminToken');
    console.log('🔐 Authentication token:', token ? 'Present' : 'Missing');
    console.log('🔐 Token value:', token ? token.substring(0, 20) + '...' : 'None');
    
    if (!token) {
      console.error('❌ No authentication token found! Please log in first.');
      alert('Please log in to the admin panel first!');
      return;
    }
    console.log('✅ Authentication token found');
    
    setLoading(true);
    try {
      console.log('🔄 Calling updateSectionConfig API...');
      console.log('🔄 Data being sent:', JSON.stringify(sections, null, 2));
      const response = await updateSectionConfig(sections);
      console.log('✅ API response:', response);
      setSuccess(true);
      console.log('🔄 Refreshing local config...');
      await refreshConfig();
      
      // Trigger global config refresh to update main website
      console.log('🔄 Triggering global config refresh...');
      triggerConfigRefresh();
      
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('❌ Failed to save section config:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Full error object:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to save section config';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.statusText) {
        errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
      }
      
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert(`Failed to save: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      console.log('✅ Save operation completed');
    }
  };

  const handleInputChange = (sectionKey, field, value) => {
    console.log(`📝 Input changed: ${sectionKey}.${field} = "${value}"`);
    setSections(prev => {
      const newSections = {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [field]: value
        }
      };
      console.log('🔄 Updated sections state:', newSections);
      return newSections;
    });
  };

  const handleNestedInputChange = (sectionKey, nestedKey, field, value) => {
    console.log(`📝 Nested input changed: ${sectionKey}.${nestedKey}.${field} = "${value}"`);
    setSections(prev => {
      const newSections = {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [nestedKey]: {
            ...prev[sectionKey][nestedKey],
            [field]: value
          }
        }
      };
      console.log('🔄 Updated sections state:', newSections);
      return newSections;
    });
  };

  const sectionConfigs = [
    {
      key: 'about',
      label: 'About Section',
      icon: '💭',
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { key: 'title', label: 'Badge Text', placeholder: 'Get to Know Me' },
        { key: 'mainTitle', label: 'Main Title', placeholder: 'Get to Know Me' },
        { key: 'description', label: 'Section Description', placeholder: 'A glimpse into my world...' }
      ]
    },
    {
      key: 'stats',
      label: 'Stats Section',
      icon: '📊',
      color: 'from-green-500 to-teal-500',
      fields: [
        { key: 'title', label: 'Badge Text', placeholder: 'My Journey' },
        { key: 'mainTitle', label: 'Main Title', placeholder: 'Achievements & Skills' },
        { key: 'description', label: 'Description', placeholder: 'A glimpse into my professional journey...' }
      ]
    },
    {
      key: 'projects',
      label: 'Projects Section',
      icon: '🎯',
      color: 'from-blue-500 to-indigo-500',
      fields: [
        { key: 'title', label: 'Badge Text', placeholder: 'My Creations' },
        { key: 'mainTitle', label: 'Main Title', placeholder: 'Amazing Projects' },
        { key: 'description', label: 'Description', placeholder: 'Check out some of my favorite projects...' }
      ]
    },
    {
      key: 'experience',
      label: 'Experience Section',
      icon: '💼',
      color: 'from-yellow-500 to-orange-500',
      fields: [
        { key: 'title', label: 'Badge Text', placeholder: 'My Journey' },
        { key: 'mainTitle', label: 'Main Title', placeholder: 'My Adventure So Far' },
        { key: 'description', label: 'Description', placeholder: 'A colorful journey through...' }
      ]
    },
    {
      key: 'testimonials',
      label: 'Testimonials Section',
      icon: '💙',
      color: 'from-blue-500 to-teal-500',
      fields: [
        { key: 'title', label: 'Badge Text', placeholder: 'What People Say' },
        { key: 'mainTitle', label: 'Main Title', placeholder: 'Lovely Testimonials' },
        { key: 'description', label: 'Description', placeholder: 'Hear what amazing people have to say...' }
      ]
    },
    {
      key: 'contact',
      label: 'Contact Section',
      icon: '💌',
      color: 'from-emerald-500 to-teal-500',
      fields: [
        { key: 'title', label: 'Badge Text', placeholder: 'Get In Touch' },
        { key: 'mainTitle', label: 'Main Title', placeholder: "Let's Connect" },
        { key: 'description', label: 'Description', placeholder: 'Ready to work together...' }
      ]
    },
    {
      key: 'thankYou',
      label: 'Thank You Section',
      icon: '🎉',
      color: 'from-pink-500 to-rose-500',
      fields: [
        { key: 'title', label: 'Section Title', placeholder: 'Thank You' },
        { key: 'mainTitle', label: 'Main Title', placeholder: 'Thanks for Reaching Out!' },
        { key: 'description', label: 'Description', placeholder: "I'll get back to you as soon as possible..." },
        { key: 'emoji', label: 'Emoji', placeholder: '🎉' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Section Configuration</h2>
          <p className="text-slate-600">Customize titles, labels, and descriptions for all sections</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : success ? 'Saved!' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Section Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sectionConfigs.map((config) => (
          <div
            key={config.key}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 bg-gradient-to-br ${config.color} rounded-xl text-white text-xl`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{config.label}</h3>
                <p className="text-sm text-slate-500">Configure section content</p>
              </div>
            </div>

            {/* Main Fields */}
            <div className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={sections[config.key]?.[field.key] || ''}
                    onChange={(e) => handleInputChange(config.key, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                  />
                </div>
              ))}

              {/* Nested Fields */}
              {config.nested && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-700">Card Configurations</h4>
                  {config.nested.map((nested) => (
                    <div key={nested.key} className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-medium text-slate-700 mb-3">{nested.label}</h5>
                      <div className="space-y-3">
                        {nested.fields.map((field) => (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-slate-600 mb-1">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={sections[config.key]?.[nested.key]?.[field.key] || ''}
                              onChange={(e) => handleNestedInputChange(config.key, nested.key, field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSectionConfig; 