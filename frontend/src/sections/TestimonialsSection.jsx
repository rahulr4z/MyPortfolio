import React, { useState, useEffect } from "react";
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { getTestimonials } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';
import { ChevronLeft, ChevronRight, Heart, X, RotateCcw } from 'lucide-react';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
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

  // Get section config data with fallbacks
  const testimonialsConfig = sectionConfig?.testimonials || {
    title: "What People Say",
    mainTitle: "Lovely Testimonials",
    description: "Hear what amazing people have to say about working with me! 💬"
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSwipe = (info) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      handlePrevious();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, currentIndex]);

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

        {/* Interactive Card Stack */}
        <div className="flex justify-center items-center min-h-[600px] relative">
          {/* Desktop: 3D Card Stack */}
          <div className="hidden md:block relative w-full max-w-2xl">
            <div className="relative h-[600px]">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {testimonials.map((testimonial, index) => {
                  const isActive = index === currentIndex;
                  const isNext = index === (currentIndex + 1) % testimonials.length;
                  const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                  
                  if (!isActive && !isNext && !isPrev) return null;

                  return (
                    <motion.div
                      key={`testimonial-${index}`}
                      custom={direction}
                      initial={{ 
                        x: direction > 0 ? 300 : -300,
                        y: 50,
                        scale: 0.8,
                        rotateY: direction > 0 ? 15 : -15,
                        opacity: 0
                      }}
                      animate={{ 
                        x: isActive ? 0 : isNext ? 100 : -100,
                        y: isActive ? 0 : 30,
                        scale: isActive ? 1 : 0.9,
                        rotateY: isActive ? 0 : isNext ? 5 : -5,
                        opacity: isActive ? 1 : 0.7
                      }}
                      exit={{ 
                        x: direction > 0 ? -300 : 300,
                        y: 50,
                        scale: 0.8,
                        rotateY: direction > 0 ? -15 : 15,
                        opacity: 0
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30 
                      }}
                      className={`absolute inset-0 ${
                        isActive ? 'z-20' : isNext ? 'z-10' : 'z-0'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                    >
                      <TestimonialCard 
                        testimonial={testimonial} 
                        isActive={isActive}
                        onSwipe={handleSwipe}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: Full-Screen Swipe */}
          <div className="md:hidden w-full">
            <div className="relative h-[600px]">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={`mobile-testimonial-${currentIndex}`}
                  custom={direction}
                  initial={{ 
                    x: direction > 0 ? 400 : -400,
                    opacity: 0
                  }}
                  animate={{ 
                    x: 0,
                    opacity: 1
                  }}
                  exit={{ 
                    x: direction > 0 ? -400 : 400,
                    opacity: 0
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  className="absolute inset-0"
                >
                  <TestimonialCard 
                    testimonial={testimonials[currentIndex]} 
                    isActive={true}
                    onSwipe={handleSwipe}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-emerald-600" />
            </motion.button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex 
                      ? 'bg-emerald-500' 
                      : 'bg-emerald-200 hover:bg-emerald-300'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-emerald-600" />
            </motion.button>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-emerald-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, isActive, onSwipe }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const scale = useTransform(x, [-200, 200], [0.95, 1.05]);

  const handleDragEnd = (event, info) => {
    onSwipe(info);
  };

  return (
    <motion.div
      drag={isActive ? "x" : false}
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, scale }}
      whileHover={isActive ? { scale: 1.02 } : {}}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 h-full flex flex-col relative group">
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-4xl text-emerald-400 opacity-60">
          "
        </div>
        
        {/* Testimonial Content */}
        <div className="pt-12 flex-1 flex flex-col">
          <p className="text-gray-700 leading-relaxed mb-8 italic text-lg flex-1">
            {testimonial.message || testimonial.content || testimonial.testimonial}
          </p>
          
          {/* Author Info */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {testimonial.name?.charAt(0) || '?'}
            </div>
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

        {/* Swipe Indicators (Mobile) */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 text-4xl opacity-0 group-hover:opacity-20 transition-opacity">
              <X />
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 text-4xl opacity-0 group-hover:opacity-20 transition-opacity">
              <Heart />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TestimonialsSection; 