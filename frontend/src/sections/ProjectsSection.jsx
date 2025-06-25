import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';
import { X, ExternalLink, Github, Globe, Sparkles, Heart, Star, Zap } from 'lucide-react';

// Cute Modal Component with Enhanced Design
const ProjectModal = ({ isOpen, onClose, project }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && project?.live_url) {
      setIsLoading(true);
      setIframeError(false);
      setIframeLoaded(false);
    }
  }, [isOpen, project]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(false);
    setIsLoading(false);
  };

  const handleOpenInNewTab = () => {
    if (project?.live_url) {
      const fullUrl = project.live_url.startsWith('http') ? project.live_url : `https://${project.live_url}`;
      window.open(fullUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  const projectUrl = project?.live_url ? 
    (project.live_url.startsWith('http') ? project.live_url : `https://${project.live_url}`) : 
    null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Floating Cute Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-20 text-2xl pointer-events-none text-white"
        >
          🌟
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-20 text-2xl pointer-events-none text-white"
        >
          ✨
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-200 w-full h-full max-w-[98vw] max-h-[98vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cute Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-teal-400 to-cyan-400 rounded-3xl opacity-20" />
          <div className="absolute inset-[4px] bg-white rounded-3xl" />
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Minimal Header - Just Close Button */}
            <div className="absolute top-4 right-4 z-20">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-black/50 hover:bg-black/70 text-white transition-colors p-3 rounded-full backdrop-blur-sm border border-white/20"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Full-Screen Webview Content */}
            <div className="flex-1 relative overflow-hidden">
              {!projectUrl ? (
                // No URL available
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🌐</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Live URL</h3>
                    <p className="text-gray-600 mb-4">
                      This project doesn't have a live URL configured yet.
                    </p>
                    {project?.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <Github className="w-4 h-4" />
                        View on GitHub
                      </motion.a>
                    )}
                  </div>
                </div>
              ) : iframeError ? (
                // Iframe error
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Project</h3>
                    <p className="text-gray-600 mb-4">
                      The project website couldn't be loaded. This might be due to CORS restrictions or the site being unavailable.
                    </p>
                    <motion.button
                      onClick={handleOpenInNewTab}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Full-screen webview iframe
                <div className="relative h-full">
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center z-10">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 border-4 border-blue-300 border-t-teal-600 rounded-full mx-auto mb-4"
                        />
                        <p className="text-teal-600 font-medium">Loading project... 🚀</p>
                      </div>
                    </div>
                  )}
                  
                  <iframe
                    src={projectUrl}
                    className="w-full h-full border-0"
                    title={`${project?.title || 'Project'} Preview`}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sectionConfig } = useSectionConfig();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setError('No projects data available');
        }
      } catch (error) {
        console.error('Failed to load projects data:', error);
        setError('Failed to load projects data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get section config data with fallbacks
  const projectsConfig = sectionConfig?.projects || {
    title: "My Creations",
    mainTitle: "Amazing Projects",
    description: "Check out some of my favorite projects and creations! 🚀"
  };

  // Get unique categories from projects, excluding 'all' to prevent duplicates
  const uniqueCategories = [...new Set(projects.map(project => project.category).filter(Boolean))];
  const categories = ['all', ...uniqueCategories.filter(cat => cat !== 'all')];

  // Get project counts for each category
  const getProjectCount = (category) => {
    if (category === 'all') return projects.length;
    return projects.filter(project => project.category === category).length;
  };

  // Filter projects by selected category
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
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
          <p className="text-teal-600 text-lg font-medium">Loading amazing projects... 🚀</p>
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

  if (!projects || projects.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-600">No projects available</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        {/* Enhanced Fun Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-16 text-blue-400 text-3xl opacity-60"
          >
            🚀
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
            className="absolute bottom-32 right-24 text-teal-400 text-2xl opacity-60"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 left-1/4 text-cyan-400 text-xl opacity-50"
          >
            💫
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/3 right-1/3 text-blue-300 text-lg opacity-50"
          >
            🌟
          </motion.div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block mb-6 group"
            >
              <span className="inline-block px-8 py-4 bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-blue-300 relative overflow-hidden">
                <motion.div
                  animate={{ 
                    x: [-100, 100],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 bg-white/20"
                />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  {projectsConfig.title}
                  <span className="text-xl">🎨</span>
                </span>
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              {projectsConfig.mainTitle}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {projectsConfig.description}
            </motion.p>
          </div>

          {/* Enhanced Category Filter */}
          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center mb-12"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-2 shadow-xl border-2 border-blue-200/50">
                <div className="flex flex-wrap gap-1">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border-2 relative overflow-hidden ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-500 via-teal-500 to-cyan-500 text-white shadow-lg border-blue-400 shadow-blue-500/25'
                          : 'bg-white/80 text-gray-700 hover:bg-blue-50/80 border-blue-200/50 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {/* Active state background animation */}
                      {selectedCategory === category && (
                        <motion.div
                          animate={{ 
                            x: [-100, 100],
                            opacity: [0, 0.3, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="absolute inset-0 bg-white/20"
                        />
                      )}
                      
                      <span className="relative z-10 flex items-center gap-2">
                        {category === 'all' ? (
                          <>
                            <span className="text-lg">🌟</span>
                            All Projects
                            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                              {getProjectCount(category)}
                            </span>
                            <span className="text-lg">🌟</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">
                              ✨
                            </span>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                              {getProjectCount(category)}
                            </span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Projects Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-blue-200 hover:shadow-blue-200/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                    {/* Enhanced Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Floating Decorative Elements */}
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute top-3 right-3 text-blue-300 opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      ✨
                    </motion.div>
                    
                    <div className="relative z-10">
                      {/* Project Emoji */}
                      <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-500">
                        {project.image_url || '✨'}
                      </div>

                      {/* Project Category */}
                      {project.category && project.category !== 'all' && (
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                            {project.category}
                          </span>
                        </div>
                      )}

                      {/* Project Title */}
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                        {project.title}
                      </h3>

                      {/* Project Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {project.short_description || project.description}
                      </p>

                      {/* Enhanced Technologies */}
                      {project.technologies && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.split(',').map((tech, techIndex) => (
                              <motion.span
                                key={techIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: techIndex * 0.1 }}
                                className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-md text-xs font-medium border border-gray-300"
                              >
                                {tech.trim()}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Project Links */}
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => handleViewProject(project)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border-2 border-blue-400"
                        >
                          <Globe className="w-4 h-4" />
                          View Project
                        </motion.button>
                        {project.github_url && (
                          <motion.a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center border-2 border-gray-700"
                          >
                            <Github className="w-4 h-4" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No projects message for filtered results */}
          {filteredProjects.length === 0 && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-blue-200/50 max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
                <p className="text-gray-600 mb-4">
                  No projects found in the "{selectedCategory === 'all' ? 'All Projects' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}" category.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  View All Projects
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        project={selectedProject} 
      />
    </>
  );
};

export default ProjectsSection; 