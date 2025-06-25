import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStats, getAwards, getEducation, getCertifications, getSkills } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';
import { X, ExternalLink, FileText } from 'lucide-react';

// Certificate Modal Component with Enhanced Design
const CertificateModal = ({ isOpen, onClose, certificate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && certificate?.certificate_link) {
      setIsLoading(true);
      setIframeError(false);
      setIframeLoaded(false);
    }
  }, [isOpen, certificate]);

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
    if (certificate?.certificate_link) {
      const fullUrl = certificate.certificate_link.startsWith('http') ? certificate.certificate_link : `https://${certificate.certificate_link}`;
      window.open(fullUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  const certificateUrl = certificate?.certificate_link ? 
    (certificate.certificate_link.startsWith('http') ? certificate.certificate_link : `https://${certificate.certificate_link}`) : 
    null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{certificate?.icon || "📜"}</div>
              <div>
                <h2 className="text-xl font-bold">{certificate?.name || "Certificate"}</h2>
                <p className="text-green-100 text-sm">{certificate?.issuer} - {certificate?.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleOpenInNewTab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative overflow-hidden">
            {!certificateUrl ? (
              // No URL available
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📜</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Certificate URL</h3>
                  <p className="text-gray-600 mb-4">
                    This certificate doesn't have a verification URL configured yet.
                  </p>
                  {certificate?.certificate_id && (
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
                      <span className="font-semibold">Certificate ID:</span> {certificate.certificate_id}
                    </div>
                  )}
                </div>
              </div>
            ) : iframeError ? (
              // Iframe error
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Certificate</h3>
                  <p className="text-gray-600 mb-4">
                    The certificate verification page couldn't be loaded. This might be due to CORS restrictions or the site being unavailable.
                  </p>
                  <motion.button
                    onClick={handleOpenInNewTab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-green-300 border-t-emerald-600 rounded-full mx-auto mb-4"
                      />
                      <p className="text-emerald-600 font-medium">Loading certificate... 📜</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={certificateUrl}
                  className="w-full h-full border-0"
                  title={`${certificate?.name || 'Certificate'} Verification`}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

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

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setIsCertificateModalOpen(true);
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
                        <div className="flex-1">
                          <p className="font-bold text-green-900">{cert.name}</p>
                          <p className="text-sm text-green-700">{cert.issuer} - {cert.year}</p>
                          {cert.certificate_link && (
                            <div className="mt-2">
                              <button 
                                onClick={() => handleViewCertificate(cert)}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-100 rounded-full px-2 py-1 hover:bg-blue-200 transition-colors cursor-pointer"
                              >
                                <span>🔗</span>
                                <span>View Certificate</span>
                              </button>
                            </div>
                          )}
                          {cert.certificate_id && !cert.certificate_link && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-100 rounded-full px-2 py-1">
                                <span>🆔</span>
                                <span>ID: {cert.certificate_id}</span>
                              </span>
                            </div>
                          )}
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

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        certificate={selectedCertificate}
      />
    </section>
  );
};

export default StatsSection; 