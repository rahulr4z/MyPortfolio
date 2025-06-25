import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTestimonials } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const { sectionConfig } = useSectionConfig();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestimonials();
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials data');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch/swipe functionality for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Manual navigation functions
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Get section config data with fallbacks
  const testimonialsConfig = sectionConfig?.testimonials || {
    title: "What People Say",
    mainTitle: "Lovely Testimonials",
    description: "Hear what amazing people have to say about working with me! 💬"
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-300 border-t-teal-600 rounded-full mx-auto mb-6"
          />
          <p className="text-teal-600 text-lg font-medium">Loading testimonials... 💬</p>
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
    <section id="testimonials" className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Fun Background Elements */}
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
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-emerald-300">
              <span className="mr-2">💬</span>
              {testimonialsConfig.title}
              <span className="ml-2">💬</span>
            </span>
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

        {/* Testimonials Container */}
        <div 
          className="relative"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop Layout - Horizontal Carousel */}
          {!isMobile && (
            <div className="relative overflow-hidden">
              {/* Desktop Navigation Chevrons */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-300 hover:scale-110"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-emerald-600" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-300 hover:scale-110"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-emerald-600" />
              </button>

              {/* Desktop Carousel */}
              <motion.div
                animate={{ x: -currentIndex * 552 }} // 504px card + 8px gap
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex gap-8"
                style={{ width: `${testimonials.length * 552}px` }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`testimonial-desktop-${index}`}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 min-w-[504px] max-w-[504px] relative group h-[750px] flex flex-col"
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 text-4xl text-emerald-400 opacity-60">
                      "
                    </div>
                    
                    {/* Testimonial Content */}
                    <div className="pt-12 flex-1 flex flex-col">
                      <p className="text-gray-700 leading-relaxed mb-8 italic text-base line-clamp-6 flex-1">
                        {testimonial.message || testimonial.content || testimonial.testimonial}
                      </p>
                      
                      {/* Author Info */}
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl font-bold text-gray-800 truncate">
                            {testimonial.name}
                          </h4>
                          <p className="text-emerald-600 font-medium text-base truncate">
                            {testimonial.position || testimonial.title}
                          </p>
                          {testimonial.company && (
                            <p className="text-gray-600 text-sm truncate">
                              {testimonial.company}
                            </p>
                          )}
                          {testimonial.relation && (
                            <p className="text-emerald-500 text-sm font-medium bg-emerald-100 rounded-full px-3 py-1 inline-block mt-2">
                              {testimonial.relation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Mobile Layout - Vertical Stack */}
          {isMobile && (
            <div className="space-y-6">
              {/* Current Testimonial Card */}
              <motion.div
                key={`testimonial-mobile-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-emerald-200 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 text-3xl text-emerald-400 opacity-60">
                  "
                </div>
                
                {/* Testimonial Content */}
                <div className="pt-8">
                  <p className="text-gray-700 leading-relaxed mb-6 italic text-base">
                    {testimonials[currentIndex]?.message || testimonials[currentIndex]?.content || testimonials[currentIndex]?.testimonial}
                  </p>
                  
                  {/* Author Info */}
                  <div className="border-t border-emerald-100 pt-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                      {testimonials[currentIndex]?.name}
                    </h4>
                    <p className="text-emerald-600 font-medium text-sm mb-1">
                      {testimonials[currentIndex]?.position || testimonials[currentIndex]?.title}
                    </p>
                    {testimonials[currentIndex]?.company && (
                      <p className="text-gray-600 text-sm mb-2">
                        {testimonials[currentIndex]?.company}
                      </p>
                    )}
                    {testimonials[currentIndex]?.relation && (
                      <p className="text-emerald-500 text-xs font-medium bg-emerald-100 rounded-full px-3 py-1 inline-block">
                        {testimonials[currentIndex]?.relation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Mobile Navigation */}
              <div className="flex items-center justify-between">
                {/* Previous/Next Buttons */}
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {currentIndex + 1} of {testimonials.length}
                  </span>
                  <div className="flex space-x-1">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-emerald-500 scale-125' 
                            : 'bg-emerald-200 hover:bg-emerald-300'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
                  aria-label="Next testimonial"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Swipe Hint */}
              <div className="text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <span>💡</span>
                  Swipe left/right to navigate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 