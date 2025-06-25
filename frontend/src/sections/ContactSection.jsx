import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { submitContactForm, getContactInfo } from '../services/api';
import { useSectionConfig } from '../contexts/SectionConfigContext';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { sectionConfig } = useSectionConfig();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch {
        setContactInfo([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const contactConfig = sectionConfig?.contact || {
    title: "Get In Touch",
    mainTitle: "Let's Connect",
    description: "Ready to collaborate? Let's discuss how we can work together"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting contact form...');
      const response = await submitContactForm(formData);
      console.log('Contact form response:', response);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Helper function to get icon for contact type
  const getContactIcon = (type) => {
    switch (type) {
      case 'email': return '📧';
      case 'phone': return '📱';
      case 'linkedin': return '💼';
      case 'github': return '🐙';
      case 'website': return '🌐';
      default: return '📞';
    }
  };

  // Helper function to format contact value for href attribute
  const formatContactHref = (type, value) => {
    switch (type) {
      case 'email':
        return `mailto:${value}`;
      case 'phone':
        return `tel:${value}`;
      case 'linkedin':
      case 'github':
      case 'website':
        return value.startsWith('http') ? value : `https://${value}`;
      default:
        return '#'; // Return a safe default for unknown types
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Cute Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Contact Icons */}
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
          📧
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
          💬
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
          📱
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-6 group"
          >
            <span className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white text-lg font-bold rounded-full shadow-xl border-2 border-emerald-300 backdrop-blur-sm relative overflow-hidden group-hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="mr-3">💌</span>
              {contactConfig.title}
              <span className="ml-3">💌</span>
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            {contactConfig.mainTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {contactConfig.description}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-emerald-50/80">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-50" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Send me a message 💬</h3>
                  
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="text-6xl mb-4">🎉</div>
                      <h4 className="text-xl font-bold text-emerald-600 mb-2">Message Sent!</h4>
                      <p className="text-gray-600">Thank you for reaching out. I'll get back to you soon!</p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-300"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name ✨
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
                          placeholder="Your amazing name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email 📧
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message 💭
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm resize-none"
                          placeholder="Tell me about your amazing project idea!"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Sending...
                          </span>
                        ) : (
                          'Send Message 🚀'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-teal-200 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-teal-50/80">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 opacity-50" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Let's chat! 💬</h3>
                  
                  <div className="space-y-6">
                    {contactInfo.map((contact) => (
                      <div key={contact.id} className="flex items-center">
                        <div className="text-3xl mr-4">{getContactIcon(contact.type)}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{contact.label || (contact.type.charAt(0).toUpperCase() + contact.type.slice(1))}</h4>
                          <a href={formatContactHref(contact.type, contact.value)} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                            {contact.value}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-cyan-200 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-cyan-50/80">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-emerald-50 to-teal-50 opacity-50" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Response ⚡</h3>
                  <p className="text-gray-600 leading-relaxed">
                    I typically respond within 24 hours. For urgent matters, feel free to reach out directly via email or phone!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;