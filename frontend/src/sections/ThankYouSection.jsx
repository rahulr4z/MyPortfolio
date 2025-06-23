import React from 'react';
import { motion } from 'framer-motion';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const ThankYouSection = () => {
  const { sectionConfig } = useSectionConfig();

  const thankYouConfig = sectionConfig?.thankYou || {
    title: "Thank You",
    mainTitle: "Thanks for Visiting!",
    description: "I appreciate you taking the time to explore my portfolio. If you enjoyed what you saw or want to collaborate, let's connect!"
  };

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Fun Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Thank You Elements */}
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 8, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-16 w-8 h-8 text-emerald-400 text-2xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0],
            scale: [1, 0.85, 1]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute top-40 right-24 w-6 h-6 text-teal-400 text-xl"
        >
          💙
        </motion.div>
        <motion.div
          animate={{ 
            x: [0, 18, 0],
            scale: [1, 1.25, 1],
            rotate: [0, 6, 0]
          }}
          transition={{ 
            duration: 11, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-32 left-1/3 w-7 h-7 text-cyan-400 text-lg"
        >
          🌟
        </motion.div>
        
        {/* Cute Sparkles */}
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
          className="absolute top-1/3 left-1/4 w-3 h-3 text-emerald-400 text-sm"
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
            delay: 2
          }}
          className="absolute bottom-1/3 right-1/4 w-3 h-3 text-teal-400 text-sm"
        >
          ✨
        </motion.div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-6 group"
          >
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-emerald-300 backdrop-blur-sm relative overflow-hidden group-hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="mr-3">🙏</span>
              {thankYouConfig.title}
              <span className="ml-3">🙏</span>
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {thankYouConfig.mainTitle}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {thankYouConfig.description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'rgb(16, 185, 129)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50"
            >
              Let's Connect! <span className="text-xl">→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouSection; 