import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getHero } from "../services/api";

const HeroSection = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getHero();
        setHeroData(data);
      } catch (err) {
        console.error('Hero section error:', err);
        setError('Failed to load hero section data');
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hero section...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  // Use heroData for all fields, fallback to defaults if missing
  const displayTitle = heroData?.title || "Hi, I'm Rahul";
  const displaySubtitle = heroData?.subtitle || "Product Manager & Developer";
  const displayDescription = heroData?.description || "Passionate about creating innovative solutions that make a difference. I combine strategic thinking with technical expertise to build products that users love.";
  const ctaText = heroData?.cta_text || "Get In Touch";

  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-screen w-full px-8 md:px-24 relative bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 overflow-hidden">
      {/* Fun Background Elements */}
      <div className="absolute inset-0">
        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-20 text-4xl opacity-60"
        >
          💙
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-32 text-3xl opacity-60"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            x: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-40 left-1/3 text-2xl opacity-60"
        >
          🌟
        </motion.div>
      </div>

      {/* Mobile: Welcome Badge First */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-center md:hidden mb-6 mt-8"
      >
        <motion.span 
          whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-teal-500 text-white text-lg font-bold rounded-full shadow-xl border-2 border-blue-300 cursor-pointer"
        >
          ✨ Welcome to My Portfolio ✨
        </motion.span>
      </motion.div>

      {/* Mobile: Simple Animation Second, Desktop: Simple Animation Right */}
      <div className="flex-1 flex items-center justify-center relative order-1 md:order-2 mt-4 md:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
        >
          <div className="text-8xl md:text-9xl">🚀</div>
        </motion.div>
      </div>

      {/* Mobile: Text Content Third, Desktop: Text Content Left */}
      <div className="flex-1 flex flex-col justify-center z-10 order-2 md:order-1 text-center md:text-left mb-8 md:mb-0">
        {/* Desktop: Welcome Badge (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 hidden md:block"
        >
          <motion.span 
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-teal-500 text-white text-lg font-bold rounded-full shadow-xl border-2 border-blue-300 cursor-pointer"
          >
            ✨ Welcome to My Portfolio ✨
          </motion.span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-2"
        >
          {displayTitle}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-500">
            {displaySubtitle}
          </span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed mx-auto md:mx-0"
        >
          {displayDescription}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center md:justify-start"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'rgb(79, 70, 229)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 bg-transparent border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          >
            {ctaText} <span className="text-xl">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 