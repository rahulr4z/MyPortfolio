import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStats, getAwards, getEducation, getCertifications, getSkills } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [awards, setAwards] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    awards: false,
    education: false,
    certifications: false,
    skills: false
  });

  const { sectionConfig } = useSectionConfig();

  // Fetch all data from API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statsData, awardsData, educationData, certificationsData, skillsData] = await Promise.all([
          getStats(),
          getAwards(),
          getEducation(),
          getCertifications(),
          getSkills()
        ]);

        setStats(statsData || []);
        setAwards(awardsData || []);
        setEducation(educationData || []);
        setCertifications(certificationsData || []);
        setSkills(skillsData.map(s => ({...s, skills: s.skills.split(',').map(i => i.trim())})) || []);

      } catch {
        setStats([]);
        setAwards([]);
        setEducation([]);
        setCertifications([]);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const statsConfig = sectionConfig?.stats || {
    title: "My Journey",
    mainTitle: "Achievements & Skills",
    description: "A glimpse into my professional journey and expertise"
  };

  const getSkillTagColor = (category) => {
    switch (category.toLowerCase()) {
      case 'languages':
        return 'bg-blue-100 text-blue-800';
      case 'frameworks & libraries':
        return 'bg-green-100 text-green-800';
      case 'databases':
        return 'bg-indigo-100 text-indigo-800';
      case 'tools & platforms':
        return 'bg-pink-100 text-pink-800';
      case 'methodologies':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 relative overflow-hidden flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-300 border-t-teal-600 rounded-full mx-auto mb-6"
          />
          <p className="text-teal-600 text-lg font-medium">Loading achievements... ✨</p>
        </div>
      </section>
    );
  }

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-16 text-3xl opacity-40"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -8, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-24 text-2xl opacity-40"
        >
          🌿
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
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500 text-white text-lg font-bold rounded-full shadow-xl border-2 border-green-300 cursor-pointer"
            >
              <span className="mr-2">🌿</span>
              {statsConfig.title}
              <span className="ml-2">🌿</span>
            </motion.span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {statsConfig.mainTitle}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {statsConfig.description}
          </motion.p>
        </div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-green-200/50 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>
                <motion.div
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Collapsible Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Awards Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-500 overflow-hidden">
            <button onClick={() => toggleSection('awards')} className="w-full p-6 text-left flex justify-between items-center hover:bg-yellow-50 transition-colors">
              <h3 className="text-2xl font-bold text-yellow-800">🏆 Awards & Recognition</h3>
              <motion.div animate={{ rotate: expandedSections.awards ? 180 : 0 }}>
                <svg className="w-6 h-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.awards && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-4">
                    {awards.map(award => (
                      <li key={award.id} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                        <span className="text-3xl">{award.icon}</span>
                        <div>
                          <p className="font-bold text-yellow-900">{award.title}</p>
                          <p className="text-sm text-yellow-700">{award.organization} - {award.year}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden">
             <button onClick={() => toggleSection('education')} className="w-full p-6 text-left flex justify-between items-center hover:bg-blue-50 transition-colors">
              <h3 className="text-2xl font-bold text-blue-800">🎓 Education</h3>
              <motion.div animate={{ rotate: expandedSections.education ? 180 : 0 }}>
                <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.education && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-4">
                    {education.map(edu => (
                      <li key={edu.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                        <span className="text-3xl">{edu.icon}</span>
                        <div>
                          <p className="font-bold text-blue-900">{edu.degree}</p>
                          <p className="text-sm text-blue-700">{edu.institution} - {edu.year}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Certifications Section */}
           <div className="bg-white rounded-2xl shadow-lg border-2 border-green-500 overflow-hidden">
             <button onClick={() => toggleSection('certifications')} className="w-full p-6 text-left flex justify-between items-center hover:bg-green-50 transition-colors">
              <h3 className="text-2xl font-bold text-green-800">📜 Certifications</h3>
              <motion.div animate={{ rotate: expandedSections.certifications ? 180 : 0 }}>
                <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSections.certifications && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-4">
                    {certifications.map(cert => (
                      <li key={cert.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                        <span className="text-3xl">{cert.icon}</span>
                        <div>
                          <p className="font-bold text-green-900">{cert.name}</p>
                          <p className="text-sm text-green-700">{cert.issuer} - {cert.year}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-500 overflow-hidden">
            <button onClick={() => toggleSection('skills')} className="w-full p-6 text-left flex justify-between items-center hover:bg-purple-50 transition-colors">
                <h3 className="text-2xl font-bold text-purple-800">🛠️ Skills</h3>
                <motion.div animate={{ rotate: expandedSections.skills ? 180 : 0 }}>
                  <svg className="w-6 h-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
              </button>
            <AnimatePresence>
              {expandedSections.skills && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-4">
                    {skills.map(skillCat => (
                      <li key={skillCat.id} className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                        <span className="text-3xl mt-1">⚙️</span>
                        <div>
                          <p className="font-bold text-purple-900">{skillCat.category}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {skillCat.skills.map((skill, i) => (
                               <span key={i} className={`px-3 py-1 text-sm rounded-full ${getSkillTagColor(skillCat.category)}`}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 