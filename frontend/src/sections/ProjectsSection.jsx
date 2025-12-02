import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const PROJECT_SCHEMA_KEY = '__projectSchema';

const PROJECT_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'impact', label: 'Impacts at work' },
  { value: 'external_case_study', label: 'External case studies' },
  { value: 'product_skill', label: 'Product skills' },
  { value: 'redesign', label: 'Redesigns' },
  { value: 'article', label: 'Articles' },
];

const parseProject = (project) => {
  let meta = null;
  if (project.description) {
    try {
      const maybeJson = JSON.parse(project.description);
      if (maybeJson && maybeJson[PROJECT_SCHEMA_KEY] === 'v2') {
        meta = maybeJson;
      }
    } catch {
      // ignore
    }
  }

  const type = project.category || meta?.projectType || 'impact';
  const ctaUrl = project.live_url || meta?.ctaUrl || '';

  return {
    id: project.id,
    type,
    raw: project,
    meta,
    order_index: project.order_index ?? 0,
    ctaUrl,
  };
};

const openLink = (url) => {
  if (!url) return;
  const fullUrl = url.startsWith('http') ? url : `https://${url.replace(/^\/+/, '')}`;
  window.open(fullUrl, '_blank');
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { sectionConfig } = useSectionConfig();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map(parseProject).sort(
            (a, b) => (a.order_index || 0) - (b.order_index || 0)
          );
          setProjects(parsed);
        } else {
          setProjects([]);
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const projectsConfig = sectionConfig?.projects || {
    title: 'Projects',
    mainTitle: 'Case studies & experiments',
    description: 'A mix of real-world impact, explorations and writing.',
  };

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.type === activeFilter);

  const renderCardContent = (project) => {
    const { meta, type, raw } = project;

    if (meta && meta[PROJECT_SCHEMA_KEY] === 'v2') {
      switch (type) {
        case 'impact':
          return (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {meta.name}
              </h3>
              {meta.problem && (
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase text-rose-600 mb-1.5 tracking-wide">
                    Problem
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{meta.problem}</p>
                </div>
              )}
              {meta.action && (
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase text-sky-600 mb-1.5 tracking-wide">
                    Action
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{meta.action}</p>
                </div>
              )}
              {meta.result && (
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-600 mb-1.5 tracking-wide">
                    Result
                  </p>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    {meta.result}
                  </p>
                </div>
              )}
            </>
          );
        case 'external_case_study':
          return (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {meta.name}
              </h3>
              {meta.caseType && (
                <p className="text-xs inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 mb-3 font-medium">
                  {meta.caseType}
                </p>
              )}
              {meta.description && (
                <p className="text-sm text-gray-700 leading-relaxed">{meta.description}</p>
              )}
            </>
          );
        case 'product_skill':
          return (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {meta.name}
              </h3>
              {meta.productType && (
                <p className="text-xs inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 mb-3 font-medium">
                  {meta.productType}
                </p>
              )}
              {meta.description && (
                <p className="text-sm text-gray-700 leading-relaxed">{meta.description}</p>
              )}
            </>
          );
        case 'redesign':
          return (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {meta.name}
              </h3>
              {meta.redesignProblem && (
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase text-orange-600 mb-1.5 tracking-wide">
                    Problem
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {meta.redesignProblem}
                  </p>
                </div>
              )}
              {meta.redesignDescription && (
                <div>
                  <p className="text-xs font-semibold uppercase text-indigo-600 mb-1.5 tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {meta.redesignDescription}
                  </p>
                </div>
              )}
            </>
          );
        case 'article':
          return (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {meta.articleTitle || raw.title}
              </h3>
              {meta.articleDescription && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {meta.articleDescription}
                </p>
              )}
            </>
          );
        default:
          break;
      }
    }

    // Fallback for legacy projects
    return (
      <>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {raw.title}
        </h3>
        {raw.short_description && (
          <p className="text-sm text-gray-700 mb-2 leading-relaxed">
            {raw.short_description}
          </p>
        )}
        {raw.description && (
          <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
            {raw.description}
          </p>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 relative overflow-hidden flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-300 border-t-violet-600 rounded-full mx-auto mb-6"
          />
          <p className="text-violet-600 text-lg font-medium">Loading amazing projects... 🚀</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-600">Projects coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 relative overflow-hidden"
    >
      {/* Background Elements */}
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
          className="absolute top-20 left-16 text-purple-400 text-2xl opacity-60"
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
          className="absolute bottom-32 right-24 text-violet-400 text-xl opacity-60"
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
            delay: 0
          }}
          className="absolute top-1/3 left-1/4 w-3 h-3 text-purple-400 text-sm"
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
          className="absolute bottom-1/3 right-1/4 w-3 h-3 text-violet-400 text-sm"
        >
          ⭐
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
            <motion.span 
              whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-purple-300 cursor-pointer"
            >
              <span className="mr-2">🚀</span>
              {projectsConfig.title}
              <span className="ml-2">🚀</span>
            </motion.span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {projectsConfig.mainTitle}
          </motion.h2>
          
          {projectsConfig.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {projectsConfig.description}
            </motion.p>
          )}
        </div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {PROJECT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <motion.button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-purple-400 shadow-lg'
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white hover:border-purple-200 shadow-md'
                }`}
              >
                {filter.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {filteredProjects.map((project, index) => {
              // Color themes for different project types
              const colorThemes = {
                impact: { border: 'border-emerald-200', bg: 'from-emerald-50 to-teal-50', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', button: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', shadow: 'shadow-emerald-200/50' },
                external_case_study: { border: 'border-blue-200', bg: 'from-blue-50 to-cyan-50', badge: 'bg-blue-100 text-blue-700 border-blue-200', button: 'bg-blue-50 text-blue-700 hover:bg-blue-100', shadow: 'shadow-blue-200/50' },
                product_skill: { border: 'border-purple-200', bg: 'from-purple-50 to-pink-50', badge: 'bg-purple-100 text-purple-700 border-purple-200', button: 'bg-purple-50 text-purple-700 hover:bg-purple-100', shadow: 'shadow-purple-200/50' },
                redesign: { border: 'border-orange-200', bg: 'from-orange-50 to-red-50', badge: 'bg-orange-100 text-orange-700 border-orange-200', button: 'bg-orange-50 text-orange-700 hover:bg-orange-100', shadow: 'shadow-orange-200/50' },
                article: { border: 'border-teal-200', bg: 'from-teal-50 to-emerald-50', badge: 'bg-teal-100 text-teal-700 border-teal-200', button: 'bg-teal-50 text-teal-700 hover:bg-teal-100', shadow: 'shadow-teal-200/50' },
              };
              
              const theme = colorThemes[project.type] || colorThemes.impact;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group"
                >
                  <div className={`h-full flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 ${theme.border} overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                    {/* Type Badge */}
                    <div className={`px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r ${theme.bg}`}>
                      <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${theme.badge} border`}>
                        {
                          PROJECT_FILTERS.find((f) => f.value === project.type)
                            ?.label
                        }
                      </span>
                      {project.order_index !== undefined && (
                        <div className="text-[10px] text-gray-400 font-medium">
                          #{project.order_index}
                        </div>
                      )}
                    </div>
                    
                    {/* Card Content */}
                    <div className="px-5 py-5 flex-1 flex flex-col">
                      {renderCardContent(project)}
                    </div>
                    
                    {/* CTA Button */}
                    {project.ctaUrl && (
                      <div className="px-5 pb-5">
                        <motion.button
                          onClick={() => openLink(project.ctaUrl)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${theme.button} transition-colors border border-transparent hover:border-current`}
                        >
                          <span>View</span>
                          <span aria-hidden="true">↗</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;


