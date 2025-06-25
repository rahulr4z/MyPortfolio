import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTestimonials } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        {/* Desktop: Card-Based Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-emerald-200 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-teal-50/30 to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-6xl text-emerald-400/20 group-hover:text-emerald-400/30 transition-colors duration-300">
                  "
                </div>
                
                {/* Testimonial Content */}
                <div className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-6 italic text-lg">
                    "{testimonial.message || testimonial.content || testimonial.testimonial}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-emerald-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-800 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-emerald-600 font-medium text-sm truncate">
                        {testimonial.position || testimonial.title}
                      </p>
                      {testimonial.company && (
                        <p className="text-gray-600 text-xs truncate">
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                    {testimonial.relation && (
                      <span className="text-emerald-500 text-xs font-medium bg-emerald-100 rounded-full px-3 py-1">
                        {testimonial.relation}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked Cards with Swipe */}
        <div className="lg:hidden">
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-emerald-200 relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-4xl text-emerald-400/30">
                  "
                </div>
                
                {/* Testimonial Content */}
                <div className="relative z-10">
                  <p className="text-gray-700 leading-relaxed mb-4 italic text-base">
                    "{testimonial.message || testimonial.content || testimonial.testimonial}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-emerald-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-gray-800 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-emerald-600 font-medium text-sm truncate">
                        {testimonial.position || testimonial.title}
                      </p>
                      {testimonial.company && (
                        <p className="text-gray-600 text-xs truncate">
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                    {testimonial.relation && (
                      <span className="text-emerald-500 text-xs font-medium bg-emerald-100 rounded-full px-2 py-1">
                        {testimonial.relation}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 