import React, { useState } from 'react';
import { Save, Star, Loader2, CheckCircle2 } from 'lucide-react';

const AdminThankYou = () => {
  const [thankYouConfig, setThankYouConfig] = useState({
    title: "Thank You",
    mainTitle: "Thanks for Reaching Out!",
    description: "I'll get back to you as soon as possible. In the meantime, feel free to explore more of my work!",
    emoji: "🎉",
    showBackButton: true,
    backButtonText: "Back to Portfolio"
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would save to your API
      // await updateThankYouConfig(thankYouConfig);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save thank you config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setThankYouConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Thank You Section</h2>
          <p className="text-slate-600">Configure the thank you page shown after form submission</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium shadow hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Main Content</h3>
          
          <div className="space-y-4">
            {/* Section Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={thankYouConfig.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Thank You"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Main Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={thankYouConfig.mainTitle}
                onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                placeholder="Thanks for Reaching Out!"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={thankYouConfig.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="I'll get back to you as soon as possible..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emoji
              </label>
              <input
                type="text"
                value={thankYouConfig.emoji}
                onChange={(e) => handleInputChange('emoji', e.target.value)}
                placeholder="🎉"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Button Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Button Settings</h3>
          
          <div className="space-y-4">
            {/* Show Back Button */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={thankYouConfig.showBackButton}
                  onChange={(e) => handleInputChange('showBackButton', e.target.checked)}
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Show Back to Portfolio Button
                </span>
              </label>
            </div>

            {/* Back Button Text */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Back Button Text
              </label>
              <input
                type="text"
                value={thankYouConfig.backButtonText}
                onChange={(e) => handleInputChange('backButtonText', e.target.value)}
                placeholder="Back to Portfolio"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Preview</h3>
        
        <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-2xl p-8 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 text-2xl opacity-20">🎉</div>
            <div className="absolute top-8 right-8 text-xl opacity-20">💖</div>
            <div className="absolute bottom-8 left-8 text-lg opacity-20">✨</div>
          </div>

          <div className="relative z-10 text-center">
            {/* Emoji */}
            <div className="text-6xl mb-6">
              {thankYouConfig.emoji}
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {thankYouConfig.mainTitle}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {thankYouConfig.description}
            </p>

            {/* Back Button */}
            {thankYouConfig.showBackButton && (
              <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg">
                {thankYouConfig.backButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThankYou; 