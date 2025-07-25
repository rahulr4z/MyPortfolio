import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Quote, Star } from 'lucide-react';
import { getTestimonials } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { sectionConfig } = useSectionConfig();
  const lastScreenSize = useRef(null);

  // Calculate how many testimonials to show initially
  const getInitialCount = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 6 : 2; // 6 for desktop (2 rows of 3), 2 for mobile
    }
    return 6; // Default for SSR
  };

  const [visibleCount, setVisibleCount] = useState(getInitialCount());

  // Update visible count on window resize only if not expanded and screen size actually changed
  useEffect(() => {
    const handleResize = () => {
      const currentScreenSize = window.innerWidth >= 1024 ? 'desktop' : 'mobile';
      
      // Only update if user hasn't expanded the view AND screen size actually changed
      if (!showAll && lastScreenSize.current !== currentScreenSize) {
        lastScreenSize.current = currentScreenSize;
        setVisibleCount(getInitialCount());
      }
    };

    // Set initial screen size
    if (typeof window !== 'undefined') {
      lastScreenSize.current = window.innerWidth >= 1024 ? 'desktop' : 'mobile';
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showAll]);

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setError('No testimonials available');
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  const nextTestimonial = () => {
    if (!selectedTestimonial) return;
    const currentIndex = testimonials.findIndex(t => t.id === selectedTestimonial.id);
    const nextIndex = (currentIndex + 1) % testimonials.length;
    setSelectedTestimonial(testimonials[nextIndex]);
  };

  const prevTestimonial = () => {
    if (!selectedTestimonial) return;
    const currentIndex = testimonials.findIndex(t => t.id === selectedTestimonial.id);
    const prevIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    setSelectedTestimonial(testimonials[prevIndex]);
  };

  const loadMore = () => {
    setVisibleCount(testimonials.length);
    setShowAll(true);
  };

  const showLess = () => {
    const initialCount = getInitialCount();
    setVisibleCount(initialCount);
    setShowAll(false);
  };

  // Get section config data with fallbacks
  const testimonialsConfig = sectionConfig?.testimonials || {
    title: "What People Say",
    mainTitle: "Testimonials",
    description: "Hear what colleagues and mentors have to say about working with me"
  };

  // Color themes for testimonials
  const colorThemes = [
    { border: 'border-emerald-200', quote: 'text-emerald-500', bg: 'from-emerald-400 to-teal-400' },
    { border: 'border-blue-200', quote: 'text-blue-500', bg: 'from-blue-400 to-cyan-400' },
    { border: 'border-purple-200', quote: 'text-purple-500', bg: 'from-purple-400 to-pink-400' },
    { border: 'border-orange-200', quote: 'text-orange-500', bg: 'from-orange-400 to-red-400' },
    { border: 'border-teal-200', quote: 'text-teal-500', bg: 'from-teal-400 to-emerald-400' },
    { border: 'border-indigo-200', quote: 'text-indigo-500', bg: 'from-indigo-400 to-purple-400' },
    { border: 'border-pink-200', quote: 'text-pink-500', bg: 'from-pink-400 to-rose-400' },
    { border: 'border-cyan-200', quote: 'text-cyan-500', bg: 'from-cyan-400 to-blue-400' },
  ];

  const getColorTheme = (index) => {
    return colorThemes[index % colorThemes.length];
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Apply styles to prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position and styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isModalOpen]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-300 border-t-teal-600 rounded-full mx-auto mb-6"
          />
          <p className="text-teal-600 text-lg font-medium">Loading amazing testimonials... 💬</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-600">No testimonials available</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="testimonials" className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
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
            className="absolute top-20 left-16 text-emerald-400 text-2xl opacity-60"
          >
            💬
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
            className="absolute bottom-32 right-24 text-teal-400 text-xl opacity-60"
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
                className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-emerald-300 cursor-pointer"
              >
                <span className="mr-2">💬</span>
                {testimonialsConfig.title}
                <span className="ml-2">💬</span>
              </motion.span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              {testimonialsConfig.mainTitle}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {testimonialsConfig.description}
            </motion.p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group cursor-pointer"
                onClick={() => openModal(testimonial)}
              >
                <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 ${getColorTheme(index).border} hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className={`w-8 h-8 ${getColorTheme(index).quote} opacity-60`} />
                  </div>

                  {/* Preview Text */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {testimonial.message.length > 150 
                      ? `${testimonial.message.substring(0, 150)}...` 
                      : testimonial.message
                    }
                  </p>

                  {/* Author Info */}
                  <div className="mt-auto">
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      {testimonial.company && (
                        <p className="text-xs text-emerald-600">{testimonial.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Read More Indicator */}
                  <div className="mt-4 pt-4 border-t border-emerald-100">
                    <span className="text-emerald-600 text-sm font-medium group-hover:text-emerald-700 transition-colors">
                      Read full testimonial →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More/Less Button */}
          {testimonials.length > getInitialCount() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              {!showAll ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMore}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-400"
                >
                  <span>View All Testimonials</span>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    +{testimonials.length - visibleCount} more
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showLess}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-400"
                >
                  <span>Show Less</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 ${getColorTheme(testimonials.findIndex(t => t.id === selectedTestimonial.id)).border} max-w-4xl w-full h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 md:p-6 flex-shrink-0 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-emerald-700">{selectedTestimonial.name}</h3>
                    <p className="text-teal-600 text-sm md:text-base">{selectedTestimonial.position}</p>
                    {selectedTestimonial.company && (
                      <p className="text-emerald-600 text-xs md:text-sm font-medium">{selectedTestimonial.company}</p>
                    )}
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-emerald-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mb-4 md:mb-6">
                  <Quote className={`w-8 h-8 md:w-12 md:h-12 ${getColorTheme(testimonials.findIndex(t => t.id === selectedTestimonial.id)).quote} opacity-60 mb-3 md:mb-4`} />
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {selectedTestimonial.message}
                  </p>
                </div>
              </div>

              {/* Navigation - Fixed at Bottom */}
              <div className="flex items-center justify-between p-4 md:p-6 border-t border-gray-200 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
                <button
                  onClick={prevTestimonial}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-sm md:text-base border border-emerald-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <span className="text-gray-500 text-xs md:text-sm">
                  {testimonials.findIndex(t => t.id === selectedTestimonial.id) + 1} of {testimonials.length}
                </span>
                
                <button
                  onClick={nextTestimonial}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-sm md:text-base border border-emerald-200"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TestimonialsSection; 