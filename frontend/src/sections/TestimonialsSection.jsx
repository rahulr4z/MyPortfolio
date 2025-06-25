import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { getTestimonials } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { sectionConfig } = useSectionConfig();
  
  const autoAdvanceRef = useRef(null);
  const progressRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setProgress(0);
    }, 5000); // 5 seconds per testimonial

    autoAdvanceRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2; // Increment by 2% every 100ms (5 seconds total)
      });
    }, 100);

    progressRef.current = progressInterval;
    return () => clearInterval(progressInterval);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch handlers for swipe functionality
  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
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

  const currentTestimonial = testimonials[currentIndex];

  return (
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

        {/* Instagram Story-Style Testimonials */}
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: index === currentIndex ? `${progress}%` : 
                             index < currentIndex ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ))}
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlayPause}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Play className="w-5 h-5 text-emerald-600" />
                )}
              </button>
              
              <button
                onClick={goToPrevious}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-emerald-600" />
              </button>
              
              <button
                onClick={goToNext}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-emerald-200 relative overflow-hidden cursor-grab active:cursor-grabbing"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-teal-50/30 to-cyan-50/30" />
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="text-6xl text-emerald-300 mb-6">"</div>
                  
                  {/* Testimonial Text */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic"
                  >
                    {currentTestimonial.message}
                  </motion.p>
                  
                  {/* Author Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {currentTestimonial.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {currentTestimonial.name}
                      </h4>
                      {currentTestimonial.position && (
                        <p className="text-emerald-600 font-medium">
                          {currentTestimonial.position}
                        </p>
                      )}
                      {currentTestimonial.company && (
                        <p className="text-gray-600 text-sm">
                          {currentTestimonial.company}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-emerald-500 scale-125'
                    : 'bg-gray-300 hover:bg-emerald-300'
                }`}
              />
            ))}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>💡 Swipe or use arrow keys to navigate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 