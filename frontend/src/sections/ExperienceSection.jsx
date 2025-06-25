import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getExperiences } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const ExperienceSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
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
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden"
              >
                {/* Accordion Header */}
                <motion.button
                  onClick={() => setSelectedIndex(selectedIndex === index ? -1 : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex-1">
                    {/* Company and Position */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-blue-800">
                        {experience.company}
                      </h3>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 self-start sm:self-auto"
                      >
                        {experience.period}
                      </motion.span>
                    </div>
                    
                    {/* Position */}
                    <div className="text-lg text-blue-600 font-semibold">
                      {experience.title}
                    </div>
                  </div>
                  
                  {/* Chevron Icon */}
                  <motion.div 
                    animate={{ rotate: selectedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className="px-6 pb-6"
                    >
                      {/* Description */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mb-6"
                      >
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                          <span className="text-3xl">💼</span>
                          <div>
                            <p className="font-bold text-blue-900">Role Description</p>
                            <p className="text-sm text-blue-700 leading-relaxed">{experience.description}</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Technologies */}
                      {experience.technologies && experience.technologies.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="mb-6"
                        >
                          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                            <span className="text-3xl">🛠️</span>
                            <div>
                              <p className="font-bold text-blue-900">Technologies & Skills</p>
                              <div className="flex flex-wrap gap-2 mt-2">
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
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                                  >
                                    {tech}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
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
                          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                            <span className="text-3xl">🏆</span>
                            <div>
                              <p className="font-bold text-blue-900">Key Achievements</p>
                              <ul className="space-y-2 mt-2">
                                {experience.achievements.map((achievement, achievementIndex) => (
                                  <motion.li
                                    key={achievementIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ 
                                      duration: 0.4, 
                                      delay: 0.4 + achievementIndex * 0.1 
                                    }}
                                    className="flex items-start gap-3 text-blue-700"
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
                                      className="text-blue-500 text-lg mt-0.5 flex-shrink-0"
                                    >
                                      ✨
                                    </motion.span>
                                    <span className="text-sm leading-relaxed">{achievement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Layout (Journey Path Design) */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto">
            <div className="relative min-h-[800px]">
              {/* Journey Path */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-full h-full">
                
                {/* Main Journey Path */}
                <motion.div 
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-teal-400 to-cyan-400 rounded-full"
                />
                
                {/* Winding Path with Curves */}
                <svg className="absolute left-1/2 transform -translate-x-1/2 w-full h-full" viewBox="0 0 800 800">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    d="M 400 750 Q 300 650 400 550 Q 500 450 400 350 Q 300 250 400 150 Q 500 50 400 50"
                    stroke="url(#journeyGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Journey Milestones */}
                {experiences.map((_, index) => (
                  <motion.div
                    key={`milestone-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0, 5, 0]
                    }}
                    transition={{ 
                      scale: { duration: 0.5, delay: index * 0.3 },
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
                    }}
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full border-4 border-white shadow-lg z-10"
                    style={{ 
                      bottom: `${50 + (index * 120)}px`,
                      left: `calc(50% + ${Math.sin(index * 0.8) * 60}px)`
                    }}
                  />
                ))}
                
                {/* Journey Direction Arrows */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 text-purple-500 text-2xl"
                  style={{ bottom: '200px' }}
                >
                  ⬆️
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 text-blue-500 text-xl"
                  style={{ bottom: '320px' }}
                >
                  ⬆️
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -6, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 text-pink-500 text-lg"
                  style={{ bottom: '440px' }}
                >
                  ⬆️
                </motion.div>
                
                {/* Floating Journey Elements */}
                <motion.div
                  animate={{ 
                    x: [0, 20, 0],
                    y: [0, -15, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 text-blue-400 text-lg"
                  style={{ bottom: '150px' }}
                >
                  🚀
                </motion.div>
                <motion.div
                  animate={{ 
                    x: [0, -15, 0],
                    y: [0, -10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 text-purple-400 text-lg"
                  style={{ bottom: '270px' }}
                >
                  🎯
                </motion.div>
                <motion.div
                  animate={{ 
                    x: [0, 15, 0],
                    y: [0, -12, 0],
                    rotate: [0, 8, 0]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute left-1/2 transform -translate-x-1/2 text-pink-400 text-lg"
                  style={{ bottom: '390px' }}
                >
                  ⭐
                </motion.div>
              </div>
              
              {/* Experience Cards as Journey Stops */}
              <div className="space-y-16 pt-8">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.3 }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Journey Stop Marker */}
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.3 + 0.2,
                        scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      animate={{ 
                        scale: [1, 1.15, 1],
                        y: [0, -8, 0, 8, 0]
                      }}
                      className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full border-4 border-white shadow-xl z-10 flex items-center justify-center"
                    >
                      {/* Journey Stop Icon */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          delay: index * 0.4
                        }}
                        className="text-white text-xl"
                      >
                        {index === 0 ? '🚀' : index === experiences.length - 1 ? '🏆' : '📍'}
                      </motion.div>
                      
                      {/* Journey Glow Effect */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.8, 1],
                          opacity: [0.4, 0, 0.4]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.3
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"
                      />
                    </motion.div>
                    
                    {/* Experience Card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.3 + 0.4 }}
                        whileHover={{ scale: 1.03, y: -8 }}
                        className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-100 relative overflow-hidden group"
                      >
                        {/* Journey Stage Border */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 1, delay: index * 0.3 + 0.6 }}
                          className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-400 origin-left"
                        />
                        
                        {/* Card Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          {/* Period Badge */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.3 + 0.7 }}
                            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            {experience.period}
                          </motion.div>
                          
                          {/* Title and Company */}
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.3 + 0.8 }}
                            className="text-2xl font-bold text-gray-800 mb-2"
                          >
                            {experience.title}
                          </motion.h3>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.3 + 0.9 }}
                            className="text-xl text-blue-600 font-semibold mb-4"
                          >
                            {experience.company}
                          </motion.div>
                          
                          {/* Description */}
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.3 + 1.0 }}
                            className="text-gray-700 leading-relaxed mb-6"
                          >
                            {experience.description}
                          </motion.p>
                          
                          {/* Technologies */}
                          {experience.technologies && experience.technologies.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.3 + 1.1 }}
                              className="mb-6"
                            >
                              <h4 className="text-lg font-semibold text-gray-800 mb-3">Technologies & Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {experience.technologies.map((tech, techIndex) => (
                                  <motion.span
                                    key={techIndex}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.3 + 1.2 + techIndex * 0.1 }}
                                    whileHover={{ scale: 1.08 }}
                                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                                    {tech}
                                  </motion.span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Achievements */}
                          {experience.achievements && experience.achievements.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.3 + 1.3 }}
                            >
                              <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Achievements</h4>
                              <ul className="space-y-2">
                                {experience.achievements.map((achievement, achievementIndex) => (
                                  <motion.li
                                    key={achievementIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.3 + 1.4 + achievementIndex * 0.1 }}
                                    className="flex items-start gap-3 text-gray-700"
                                  >
                                    <motion.span 
                                      animate={{ rotate: [0, 15, -15, 0] }}
                                      transition={{ duration: 2.5, repeat: Infinity, delay: achievementIndex * 0.3 }}
                                      className="text-blue-500 text-lg mt-0.5">✨</motion.span>
                                    <span>{achievement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 