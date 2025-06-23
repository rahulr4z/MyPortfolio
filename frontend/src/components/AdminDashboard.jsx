import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home,
  LogOut,
  Crown,
  Heart,
  Star,
  Award,
  TrendingUp,
  Zap,
  Palette,
  BookOpen,
  FileText,
  Wrench,
  Settings
} from 'lucide-react';
import { logout } from '../services/api';

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', icon: Crown, path: '/admin/hero', color: 'from-pink-200 to-rose-200' },
  { id: 'about', label: 'About Section', icon: Heart, path: '/admin/about', color: 'from-blue-200 to-sky-200' },
  { id: 'experiences', label: 'Experiences', icon: Award, path: '/admin/experiences', color: 'from-green-200 to-emerald-200' },
  { id: 'projects', label: 'Projects', icon: Zap, path: '/admin/projects', color: 'from-indigo-200 to-purple-200' },
  { id: 'stats', label: 'Statistics', icon: TrendingUp, path: '/admin/stats', color: 'from-orange-200 to-amber-200' },
  { id: 'testimonials', label: 'Testimonials', icon: Star, path: '/admin/testimonials', color: 'from-purple-200 to-violet-200' },
  { id: 'contact', label: 'Contact Info', icon: Palette, path: '/admin/contact', color: 'from-teal-200 to-cyan-200' },
  { id: 'awards', label: 'Awards', icon: Award, path: '/admin/awards', color: 'from-red-200 to-pink-200' },
  { id: 'education', label: 'Education', icon: BookOpen, path: '/admin/education', color: 'from-sky-200 to-blue-200' },
  { id: 'certifications', label: 'Certifications', icon: FileText, path: '/admin/certifications', color: 'from-emerald-200 to-green-200' },
  { id: 'skills', label: 'Skills', icon: Wrench, path: '/admin/skills', color: 'from-cyan-200 to-teal-200' },
  { id: 'config', label: 'Section Titles', icon: Settings, path: '/admin/config', color: 'from-gray-200 to-slate-300' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleHomeClick = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-8">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-800">Control Panel</h1>
            <p className="text-lg text-gray-600 mt-2">Select a section below to manage its content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {SECTIONS.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link 
                    to={section.path}
                    className={`block h-full p-6 rounded-2xl bg-gradient-to-br ${section.color} text-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{section.label}</h3>
                      <div className="p-3 bg-white/30 rounded-full">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-gray-600">Click to edit the {section.label.toLowerCase()}.</p>
                  </Link>
                </motion.div>
              );
            })}

            {/* View Site Card */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: SECTIONS.length * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-full"
            >
                <button
                    onClick={handleHomeClick}
                    className="w-full h-full text-left p-6 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">View Site</h3>
                        <div className="p-3 bg-white/20 rounded-full">
                            <Home className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-white/80">Open the live website in a new tab.</p>
                </button>
            </motion.div>

            {/* Logout Card */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: (SECTIONS.length + 1) * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-full"
            >
                <button
                    onClick={handleLogout}
                    className="w-full h-full text-left p-6 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">Logout</h3>
                        <div className="p-3 bg-white/20 rounded-full">
                            <LogOut className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-white/80">End your session and log out.</p>
                </button>
            </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;