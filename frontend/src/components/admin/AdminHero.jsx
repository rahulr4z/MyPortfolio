import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { updateHero, getHero, createHero } from '../../services/api';

const AdminHero = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    badge: '',
    badge_emoji: '',
    cta_text: '',
    cta_style: 'bordered',
    is_active: true
  });
  const [heroId, setHeroId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    setLoading(true);
    try {
      const data = await getHero();
      if (data) {
        // Backend returns a single hero object, not an array
        setHeroId(data.id);
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          badge: data.badge || '',
          badge_emoji: data.badge_emoji || '',
          cta_text: data.cta_text || '',
          cta_style: data.cta_style || 'bordered',
          is_active: data.is_active !== undefined ? data.is_active : true
        });
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
      setMessage({ type: 'error', text: 'Failed to load hero data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (heroId) {
        // Update existing hero
        await updateHero(heroId, formData);
      } else {
        // Create new hero
        const newHero = await createHero(formData);
        setHeroId(newHero.id);
      }
      
      setMessage({ type: 'success', text: 'Hero section updated successfully!' });
      
      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('heroDataUpdated', { detail: formData }));
      
      // Also update localStorage for cross-tab sync
      localStorage.setItem('heroData', JSON.stringify(formData));
      localStorage.setItem('lastUpdate', Date.now().toString());
    } catch (error) {
      console.error('Error updating hero data:', error);
      setMessage({ type: 'error', text: 'Failed to update hero section' });
    } finally {
      setSaving(false);
    }
  };

  const inputFields = [
    { name: 'title', label: 'Title', placeholder: 'Enter the main title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', placeholder: 'Enter the subtitle', type: 'text', required: true },
    { name: 'description', label: 'Description', placeholder: 'Enter the description', type: 'textarea', required: true },
    { name: 'badge', label: 'Badge Text', placeholder: 'Enter badge text', type: 'text', required: true },
    { name: 'badge_emoji', label: 'Badge Emoji', placeholder: '🎯', type: 'text', required: true },
    { name: 'cta_text', label: 'Call-to-Action Text', placeholder: 'Enter CTA button text', type: 'text', required: true }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading hero data...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Hero Section</h2>
            <p className="text-gray-600 mt-2">Update the main hero section content</p>
          </div>
          <button
            onClick={loadHeroData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              )}
            </div>
          ))}

          {/* CTA Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Button Style
            </label>
            <select
              name="cta_style"
              value={formData.cta_style}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="bordered">Bordered</option>
              <option value="filled">Filled</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (Show this hero section)
            </label>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminHero; 