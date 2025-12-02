import React, { useState, useEffect } from "react";
import { getStats } from '../services/api';

const StatsCounterSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load stats data');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-sky-300 border-t-sky-600 rounded-full"
          />
          <p className="mt-6 text-sky-700 text-lg font-medium">Loading amazing stats... 📊</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-sky-600 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Fun Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-sky-200 rounded-full opacity-60"
        />
        <motion.div
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 right-1/4 w-10 h-10 bg-blue-200 rounded-full opacity-60"
        />
        <motion.div
          animate={{ 
            x: [0, 8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-indigo-200 rounded-full opacity-60"
        />
      </div>

      <div className="relative z-10 container mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-block mb-6 group"
          >
            {/* Fun sparkle effects */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-300 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-2 w-3 h-3 bg-sky-300 rounded-full"
            />
            
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white text-lg font-bold rounded-full shadow-xl border-4 border-white/30 backdrop-blur-sm relative overflow-hidden group-hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="mr-3">📊</span>
              Achievements
              <span className="ml-3">📊</span>
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-sky-900 mb-6"
          >
            Numbers That <span className="text-sky-600">Matter</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-sky-700 max-w-3xl mx-auto leading-relaxed"
          >
            Quantifying success through measurable achievements and milestones
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-sky-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Fun background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-50"></div>
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    >
                      {stat.icon || "📈"}
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-4xl md:text-5xl font-bold text-sky-900 mb-3"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-lg text-sky-700 font-semibold mb-2">{stat.label}</div>
                    {stat.description && (
                      <div className="text-sm text-sky-600">{stat.description}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback stats if no data
            [
              { value: "7", label: "YOE", icon: "⏰", description: "Years of experience" },
              { value: "15", label: "Mentees", icon: "👨🏻‍🏫", description: "People mentored" },
              { value: "10", label: "0 to 1 Projects", icon: "🛠️", description: "Projects delivered" },
              { value: "25M", label: "People Served", icon: "🤝🏻", description: "Impact created" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-sky-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Fun background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-50"></div>
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-4xl md:text-5xl font-bold text-sky-900 mb-3"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-lg text-sky-700 font-semibold mb-2">{stat.label}</div>
                    <div className="text-sm text-sky-600">{stat.description}</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Fun Bottom Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-sky-100 inline-block">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sky-700 font-semibold">Ready for the next milestone!</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounterSection; 