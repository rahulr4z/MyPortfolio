import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getExperiences } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const ExperienceSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sectionConfig, loading: configLoading, error: configError } = useSectionConfig();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getExperiences();
        if (data && data.length > 0) {
          // Transform the data to match the component's expected structure
          const transformedData = data.map(exp => ({
            ...exp,
            title: exp.position, // Map position to title
            period: exp.duration, // Map duration to period
            technologies: exp.technologies ? exp.technologies.split(',').map(t => t.trim()) : [],
            achievements: exp.achievements ? exp.achievements.split('|').map(a => a.trim()) : []
          }));
          setExperiences(transformedData);
        } else {
          setError('No experience data available');
        }
      } catch (error) {
        console.error('Failed to load experience data:', error);
        setError('Failed to load experience data');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Get section config data with fallbacks
  const experienceConfig = sectionConfig?.experience || {
    title: "My Journey",
    mainTitle: "My Adventure So Far",
    description: "A colorful journey through the world of product management and innovation! 🌈"
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-300 border-t-teal-600 rounded-full mx-auto mb-6"
          />
          <p className="text-teal-600 text-lg font-medium">Loading amazing experiences... 🚀</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-600">No experience data available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Journey Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Journey Elements */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-16 w-8 h-8 text-blue-400 text-2xl"
        >
          🗺️
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -15, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-24 w-6 h-6 text-teal-400 text-xl"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-32 left-1/3 w-7 h-7 text-cyan-400 text-lg"
        >
          🎯
        </motion.div>
        
        {/* Journey Sparkles */}
        <motion.div
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            delay: 0
          }}
          className="absolute top-1/3 left-1/4 w-3 h-3 text-blue-400 text-sm"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            delay: 1.5
          }}
          className="absolute bottom-1/3 right-1/4 w-3 h-3 text-teal-400 text-sm"
        >
          ✨
        </motion.div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-6 group"
          >
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-blue-300 backdrop-blur-sm relative overflow-hidden group-hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="mr-3">🗺️</span>
              {experienceConfig.title}
              <span className="ml-3">🗺️</span>
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {experienceConfig.mainTitle}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {experienceConfig.description}
          </motion.p>
        </div>

        {/* Mobile Layout (Accordion Design) */}
        <div className="lg:hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            {experiences.map((experience, index) => {
              // Different colors for each experience card
              const colorVariants = [
                { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800', hover: 'hover:bg-blue-50', icon: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
                { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', hover: 'hover:bg-purple-50', icon: 'text-purple-700', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
                { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-800', hover: 'hover:bg-teal-50', icon: 'text-teal-700', badge: 'bg-teal-100 text-teal-700 border-teal-200' },
                { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-800', hover: 'hover:bg-indigo-50', icon: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
                { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-800', hover: 'hover:bg-pink-50', icon: 'text-pink-700', badge: 'bg-pink-100 text-pink-700 border-pink-200' }
              ];
              
              const colors = colorVariants[index % colorVariants.length];
              
              return (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 ${colors.border} overflow-hidden`}
                >
                  {/* Accordion Header */}
                  <motion.button
                    onClick={() => setSelectedIndex(selectedIndex === index ? -1 : index)}
                    className={`w-full p-6 text-left flex justify-between items-center ${colors.hover} transition-colors`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex-1">
                      {/* Company and Position */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className={`text-2xl font-bold ${colors.text}`}>
                          {experience.company}
                        </h3>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`inline-block px-3 py-1 ${colors.badge} rounded-full text-sm font-medium border self-start sm:self-auto`}
                        >
                          {experience.period}
                        </motion.span>
                      </div>
                      
                      {/* Position */}
                      <div className={`text-lg ${colors.text.replace('800', '600')} font-semibold`}>
                        {experience.title}
                      </div>
                    </div>
                    
                    {/* Chevron Icon */}
                    <motion.div 
                      animate={{ rotate: selectedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className={`w-6 h-6 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </motion.button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          height: { duration: 0.4, ease: "easeInOut" },
                          opacity: { duration: 0.3, ease: "easeInOut" }
                        }}
                        className="px-6 pb-6 space-y-6"
                      >
                        {/* Description */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <h4 className={`text-lg font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                            <span className="text-2xl">💼</span>
                            Role Description
                          </h4>
                          <p className={`text-sm ${colors.text.replace('800', '700')} leading-relaxed`}>
                            {experience.description}
                          </p>
                        </motion.div>

                        {/* Technologies */}
                        {experience.technologies && experience.technologies.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <h4 className={`text-lg font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                              <span className="text-2xl">🛠️</span>
                              Technologies & Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech, techIndex) => (
                                <motion.span
                                  key={techIndex}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ 
                                    duration: 0.3, 
                                    delay: 0.3 + techIndex * 0.05 
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-3 py-1 ${colors.badge} rounded-full text-sm font-medium border`}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Achievements */}
                        {experience.achievements && experience.achievements.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            <h4 className={`text-lg font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                              <span className="text-2xl">🏆</span>
                              Key Achievements
                            </h4>
                            <ul className="space-y-2">
                              {experience.achievements.map((achievement, achievementIndex) => (
                                <motion.li
                                  key={achievementIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    duration: 0.4, 
                                    delay: 0.4 + achievementIndex * 0.1 
                                  }}
                                  className="flex items-start gap-3"
                                >
                                  <motion.span 
                                    animate={{ 
                                      rotate: [0, 15, -15, 0],
                                      scale: [1, 1.2, 1]
                                    }}
                                    transition={{ 
                                      duration: 2, 
                                      repeat: Infinity,
                                      delay: achievementIndex * 0.2
                                    }}
                                    className={`${colors.icon} text-lg mt-0.5 flex-shrink-0`}
                                  >
                                    ✨
                                  </motion.span>
                                  <span className={`text-sm leading-relaxed ${colors.text.replace('800', '700')}`}>
                                    {achievement}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout (Center Timeline with Stacked Cards) */}
        <div className="hidden lg:block">
          <div className="max-w-6xl mx-auto relative">
            {/* Background Timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1">
              {/* Animated Timeline Path */}
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-b from-blue-400 via-purple-400 to-teal-400 rounded-full origin-top"
              />
              
              {/* Timeline Path Animation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 4 800">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  d="M 2 800 Q 1 600 2 400 Q 3 200 2 0"
                  stroke="url(#timelineGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="33%" stopColor="#8B5CF6" />
                    <stop offset="66%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Floating Timeline Elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute top-8 left-1/2 transform -translate-x-1/2 text-blue-400 text-2xl"
              >
                🚀
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -12, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, -15, 15, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-purple-400 text-xl"
              >
                ⭐
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -18, 0],
                  scale: [1, 1.3, 1],
                  rotate: [0, 20, -20, 0]
                }}
                transition={{ 
                  duration: 3.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute top-2/3 left-1/2 transform -translate-x-1/2 text-teal-400 text-2xl"
              >
                🎯
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.15, 1],
                  rotate: [0, -25, 25, 0]
                }}
                transition={{ 
                  duration: 4.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 3
                }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-pink-400 text-xl"
              >
                🏆
              </motion.div>
              
              {/* Timeline Connection Points */}
              {experiences.map((_, index) => (
                <motion.div
                  key={`timeline-point-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.3 + 1,
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    y: [0, -5, 0]
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-lg z-10"
                  style={{ 
                    top: `${20 + (index * 15)}%`
                  }}
                >
                  {/* Connection Point Glow */}
                  <motion.div
                    animate={{ 
                      scale: [1, 2, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.4
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Stacked Accordion Cards */}
            <div className="relative z-20 space-y-6">
              {experiences.map((experience, index) => {
                // Different colors for each experience card
                const colorVariants = [
                  { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800', hover: 'hover:bg-blue-50', icon: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200', shadow: 'shadow-blue-200/50' },
                  { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', hover: 'hover:bg-purple-50', icon: 'text-purple-700', badge: 'bg-purple-100 text-purple-700 border-purple-200', shadow: 'shadow-purple-200/50' },
                  { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-800', hover: 'hover:bg-teal-50', icon: 'text-teal-700', badge: 'bg-teal-100 text-teal-700 border-teal-200', shadow: 'shadow-teal-200/50' },
                  { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-800', hover: 'hover:bg-indigo-50', icon: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', shadow: 'shadow-indigo-200/50' },
                  { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-800', hover: 'hover:bg-pink-50', icon: 'text-pink-700', badge: 'bg-pink-100 text-pink-700 border-pink-200', shadow: 'shadow-pink-200/50' }
                ];
                
                const colors = colorVariants[index % colorVariants.length];
                
                return (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 1, 
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="relative"
                  >
                    {/* Card with enhanced shadow and positioning */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.02, 
                        y: -8,
                        boxShadow: `0 25px 50px -12px ${colors.shadow}`
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 ${colors.border} relative overflow-hidden group max-w-4xl mx-auto`}
                    >
                      {/* Card Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        {/* Accordion Header */}
                        <motion.button
                          onClick={() => setSelectedIndex(selectedIndex === index ? -1 : index)}
                          className={`w-full p-8 text-left flex justify-between items-center ${colors.hover} transition-colors rounded-t-3xl`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex-1">
                            {/* Period Badge */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                              className={`inline-block px-4 py-2 ${colors.badge} rounded-full text-sm font-medium mb-4`}
                            >
                              {experience.period}
                            </motion.div>
                            
                            {/* Title and Company */}
                            <motion.h3
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                              className={`text-2xl font-bold ${colors.text} mb-2`}
                            >
                              {experience.title}
                            </motion.h3>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                              className={`text-xl ${colors.text.replace('800', '600')} font-semibold`}
                            >
                              {experience.company}
                            </motion.div>
                          </div>
                          
                          {/* Chevron Icon */}
                          <motion.div 
                            animate={{ rotate: selectedIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className={`w-8 h-8 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </motion.button>

                        {/* Accordion Content */}
                        <AnimatePresence>
                          {selectedIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ 
                                height: { duration: 0.4, ease: "easeInOut" },
                                opacity: { duration: 0.3, ease: "easeInOut" }
                              }}
                              className="px-8 pb-8 space-y-6"
                            >
                              {/* Description */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                              >
                                <h4 className={`text-lg font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                                  <span className="text-2xl">💼</span>
                                  Role Description
                                </h4>
                                <p className={`text-sm ${colors.text.replace('800', '700')} leading-relaxed`}>
                                  {experience.description}
                                </p>
                              </motion.div>

                              {/* Technologies */}
                              {experience.technologies && experience.technologies.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                  <h4 className={`text-lg font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                                    <span className="text-2xl">🛠️</span>
                                    Technologies & Skills
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {experience.technologies.map((tech, techIndex) => (
                                      <motion.span
                                        key={techIndex}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ 
                                          duration: 0.3, 
                                          delay: 0.3 + techIndex * 0.05 
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        className={`px-3 py-1 ${colors.badge} rounded-full text-sm font-medium border`}
                                      >
                                        {tech}
                                      </motion.span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              {/* Achievements */}
                              {experience.achievements && experience.achievements.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                  <h4 className={`text-lg font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                                    <span className="text-2xl">🏆</span>
                                    Key Achievements
                                  </h4>
                                  <ul className="space-y-2">
                                    {experience.achievements.map((achievement, achievementIndex) => (
                                      <motion.li
                                        key={achievementIndex}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                          duration: 0.4, 
                                          delay: 0.4 + achievementIndex * 0.1 
                                        }}
                                        className="flex items-start gap-3"
                                      >
                                        <motion.span 
                                          animate={{ 
                                            rotate: [0, 15, -15, 0],
                                            scale: [1, 1.2, 1]
                                          }}
                                          transition={{ 
                                            duration: 2, 
                                            repeat: Infinity,
                                            delay: achievementIndex * 0.2
                                          }}
                                          className={`${colors.icon} text-lg mt-0.5 flex-shrink-0`}
                                        >
                                          ✨
                                        </motion.span>
                                        <span className={`text-sm leading-relaxed ${colors.text.replace('800', '700')}`}>
                                          {achievement}
                                        </span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 