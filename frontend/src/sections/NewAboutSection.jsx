import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAboutContent } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const NewAboutSection = () => {
  const { sectionConfig, loading: configLoading, error: configError } = useSectionConfig();
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAboutContent();
        if (data && data.length > 0) {
          setAboutData(data);
        } else {
          setError('No about data available');
        }
      } catch (error) {
        console.error('Failed to load about data:', error);
        setError('Failed to load about data');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading || configLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <div className="container mx-auto px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about section...</p>
        </div>
      </section>
    );
  }

  if (error || configError) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <div className="container mx-auto px-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error || configError}</p>
        </div>
      </section>
    );
  }

  if (!aboutData || aboutData.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-600">No about content available</p>
        </div>
      </section>
    );
  }

  // Get section config data with fallbacks (only for section title and description)
  const aboutConfig = sectionConfig?.about || {
    title: "Get to Know Me",
    description: "A glimpse into my world of innovation and creativity"
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 relative overflow-hidden">
      {/* Fun Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-16 text-blue-400 text-2xl opacity-60"
        >
          💭
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-24 text-cyan-400 text-xl opacity-60"
        >
          ✨
        </motion.div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-6 group"
          >
            <motion.span 
              whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-blue-300 cursor-pointer"
            >
              <span className="mr-2">💭</span>
              {aboutConfig.title}
              <span className="ml-2">💭</span>
            </motion.span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {aboutConfig.mainTitle || "Get to Know Me"}
          </motion.h2>
          
          {aboutConfig.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {aboutConfig.description}
            </motion.p>
          )}
        </div>

        {/* Fun Illustration-Based Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Who I Am - Brain Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 hover:bg-blue-50/80">
                {/* Brain Illustration */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="text-8xl mb-6"
                >
                  🧠
                </motion.div>
                
                {/* Floating Thought Bubbles */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0
                    }}
                    className="absolute -top-4 -left-4 text-2xl"
                  >
                    💡
                  </motion.div>
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute -top-2 -right-4 text-xl"
                  >
                    🎨
                  </motion.div>
                  <motion.div
                    animate={{ 
                      y: [0, -12, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 2
                    }}
                    className="absolute top-2 right-8 text-lg"
                  >
                    💬
                  </motion.div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{aboutData[0]?.title || 'Who I Am'}</h3>
                {aboutData[0]?.subtitle && (
                  <p className="text-lg text-gray-600 mb-3 font-medium">{aboutData[0].subtitle}</p>
                )}
                <p className="text-gray-700 leading-relaxed">{aboutData[0]?.description || 'Product manager with designer\'s heart, diplomat\'s tongue & engineer\'s brain'}</p>
              </div>
            </motion.div>

            {/* What I Do - Rocket Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 shadow-xl border-2 border-cyan-200 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 hover:bg-cyan-50/80">
                {/* Rocket Illustration */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="text-8xl mb-6"
                >
                  🚀
                </motion.div>
                
                {/* Rocket Trail */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0
                    }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-4xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-3xl"
                  >
                    ⭐
                  </motion.div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{aboutData[1]?.title || 'What I Do'}</h3>
                {aboutData[1]?.subtitle && (
                  <p className="text-lg text-gray-600 mb-3 font-medium">{aboutData[1].subtitle}</p>
                )}
                <p className="text-gray-700 leading-relaxed">{aboutData[1]?.description || 'Craft digital experiences that users love & businesses value'}</p>
              </div>
            </motion.div>

            {/* What Interests Me - Lightbulb Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border-2 border-indigo-200 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 hover:bg-indigo-50/80">
                {/* Lightbulb Illustration */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="text-8xl mb-6"
                >
                  💡
                </motion.div>
                
                {/* Sparkles Around Lightbulb */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute -top-2 -left-2 text-xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ 
                      rotate: [0, -360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: 1
                    }}
                    className="absolute -top-1 -right-2 text-lg"
                  >
                    🌟
                  </motion.div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.4, 1]
                    }}
                    transition={{ 
                      duration: 7, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: 2
                    }}
                    className="absolute top-2 right-4 text-sm"
                  >
                    ⭐
                  </motion.div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{aboutData[2]?.title || 'What Interests Me'}</h3>
                {aboutData[2]?.subtitle && (
                  <p className="text-lg text-gray-600 mb-3 font-medium">{aboutData[2].subtitle}</p>
                )}
                <p className="text-gray-700 leading-relaxed">{aboutData[2]?.description || 'Emerging tech, AI possibilities & real-world impact solutions'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewAboutSection; 