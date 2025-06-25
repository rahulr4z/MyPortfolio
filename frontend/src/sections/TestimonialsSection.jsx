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

        {/* Smart Testimonials Display */}
        <div className="relative">
          {/* Desktop: Floating Cards Layout */}
          {!isMobile && (
            <div className="relative min-h-[800px]">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-6 gap-8 h-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut" 
                      }}
                      className="bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Floating Testimonial Cards */}
              {testimonials.map((testimonial, index) => {
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % testimonials.length;
                const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                
                return (
                  <motion.div
                    key={`testimonial-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    animate={{
                      opacity: isActive ? 1 : (isNext || isPrev ? 0.6 : 0.3),
                      scale: isActive ? 1 : (isNext || isPrev ? 0.9 : 0.7),
                      y: isActive ? 0 : (isNext ? -50 : isPrev ? 50 : 100),
                      x: isActive ? 0 : (isNext ? 100 : isPrev ? -100 : 0),
                      rotateY: isActive ? 0 : (isNext ? 15 : isPrev ? -15 : 0),
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeInOut",
                      delay: index * 0.1 
                    }}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                      isActive ? 'z-20' : isNext || isPrev ? 'z-10' : 'z-0'
                    }`}
                    style={{
                      width: isActive ? '500px' : isNext || isPrev ? '400px' : '300px',
                    }}
                  >
                    <motion.div
                      whileHover={isActive ? { scale: 1.02, y: -5 } : {}}
                      className={`bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 transition-all duration-500 ${
                        isActive 
                          ? 'border-emerald-300 shadow-emerald-200/50' 
                          : 'border-emerald-200/50 shadow-emerald-100/30'
                      }`}
                    >
                      {/* Floating Quote Icon */}
                      <motion.div
                        animate={isActive ? { 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className={`absolute -top-4 -left-4 text-5xl ${
                          isActive ? 'text-emerald-400' : 'text-emerald-300/60'
                        }`}
                      >
                        "
                      </motion.div>

                      {/* Content */}
                      <div className={`pt-6 ${!isActive ? 'opacity-60' : ''}`}>
                        <p className={`leading-relaxed italic mb-6 line-clamp-4 ${
                          isActive ? 'text-base' : 'text-sm'
                        } text-gray-700`}>
                          {testimonial.message || testimonial.content || testimonial.testimonial}
                        </p>

                        {/* Author Info */}
                        <div className={`border-t pt-4 ${isActive ? 'border-emerald-200' : 'border-emerald-100'}`}>
                          <h4 className={`font-bold text-gray-800 mb-1 ${
                            isActive ? 'text-lg' : 'text-base'
                          }`}>
                            {testimonial.name}
                          </h4>
                          <p className={`font-medium mb-1 ${
                            isActive ? 'text-emerald-600 text-base' : 'text-emerald-500/80 text-sm'
                          }`}>
                            {testimonial.position || testimonial.title}
                          </p>
                          {testimonial.company && (
                            <p className={`${
                              isActive ? 'text-gray-600 text-sm' : 'text-gray-500/70 text-xs'
                            }`}>
                              {testimonial.company}
                            </p>
                          )}
                          {testimonial.relation && (
                            <p className={`text-xs font-medium rounded-full px-3 py-1 inline-block mt-2 ${
                              isActive 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-emerald-50 text-emerald-600/80'
                            }`}>
                              {testimonial.relation}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Interactive Overlay */}
                      {!isActive && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentIndex(index)}
                          className="absolute inset-0 bg-transparent cursor-pointer rounded-3xl"
                          aria-label={`View testimonial from ${testimonial.name}`}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Navigation Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-emerald-200">
                  <button
                    onClick={handlePrevious}
                    className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {currentIndex + 1} / {testimonials.length}
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
                    className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: Stacked Cards with Parallax */}
          {isMobile && (
            <div className="space-y-8">
              {/* Current Testimonial */}
              <motion.div
                key={`mobile-testimonial-${currentIndex}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                {/* Background Glow */}
                <motion.div
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl"
                />

                <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-2 border-emerald-200">
                  {/* Floating Quote */}
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 3, -3, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="absolute -top-3 -left-3 text-4xl text-emerald-400"
                  >
                    "
                  </motion.div>

                  {/* Content */}
                  <div className="pt-4">
                    <p className="text-gray-700 leading-relaxed italic text-base mb-6">
                      {testimonials[currentIndex]?.message || testimonials[currentIndex]?.content || testimonials[currentIndex]?.testimonial}
                    </p>

                    {/* Author Section */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        {/* Avatar Placeholder */}
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {testimonials[currentIndex]?.name?.charAt(0) || '?'}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800">
                            {testimonials[currentIndex]?.name}
                          </h4>
                          <p className="text-emerald-600 font-medium text-sm">
                            {testimonials[currentIndex]?.position || testimonials[currentIndex]?.title}
                          </p>
                          {testimonials[currentIndex]?.company && (
                            <p className="text-gray-600 text-xs">
                              {testimonials[currentIndex]?.company}
                            </p>
                          )}
                        </div>

                        {testimonials[currentIndex]?.relation && (
                          <span className="text-emerald-500 text-xs font-medium bg-emerald-100 rounded-full px-2 py-1">
                            {testimonials[currentIndex]?.relation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {currentIndex + 1} of {testimonials.length}
                  </span>
                  <div className="flex space-x-1">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-emerald-500 scale-125 shadow-md' 
                            : 'bg-emerald-200 hover:bg-emerald-300'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                  aria-label="Next testimonial"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Swipe Hint */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span className="text-emerald-400">💡</span>
                  Swipe left/right to navigate
                  <span className="text-emerald-400">💡</span>
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 