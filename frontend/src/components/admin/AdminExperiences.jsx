import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Briefcase, Calendar, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { getAdminExperiences, createExperience, updateExperience, deleteExperience } from '../../services/api';

const emptyForm = {
  position: '',
  company: '',
  duration: '',
  location: '',
  description: '',
  technologies: '',
  achievements: [],
  order_index: 0,
};

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    setLoading(true);
    try {
      const data = await getAdminExperiences();
      if (Array.isArray(data)) {
        setExperiences(data);
      } else {
        setExperiences([]);
        setError('You are not authorized. Please log in.');
      }
    } catch {
      setExperiences([]);
      setError('You are not authorized. Please log in.');
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function addAchievement() {
    setForm(f => ({ ...f, achievements: [...f.achievements, ''] }));
  }

  function removeAchievement(index) {
    setForm(f => ({ 
      ...f, 
      achievements: f.achievements.filter((_, i) => i !== index) 
    }));
  }

  function updateAchievement(index, value) {
    setForm(f => ({
      ...f,
      achievements: f.achievements.map((achievement, i) => 
        i === index ? value : achievement
      )
    }));
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(item) {
    setForm({ 
      ...item,
      achievements: item.achievements ? item.achievements.split('|').map(a => a.trim()).filter(a => a) : []
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        achievements: form.achievements.join(' | ')
      };
      
      if (editingId) {
        await updateExperience(editingId, formData);
      } else {
        await createExperience(formData);
      }
      setShowForm(false);
      fetchExperiences();
    } catch {
      setError('Failed to save experience');
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await deleteExperience(id);
      fetchExperiences();
    } catch (e) {
      console.error('Error deleting experience:', e);
    }
  };

  // Extract unique company names for dropdown
  const uniqueCompanies = [...new Set(experiences.map(exp => exp.company).filter(Boolean))].sort();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-purple-800 flex items-center gap-2">💼 Experiences</h3>
        <button onClick={startAdd} className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all">+ Add</button>
      </div>
      {loading ? (
        <div className="text-purple-500 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col gap-2 relative border-2 border-purple-100 hover:shadow-2xl transition-all">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(exp)}
                    className="p-2 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow hover:scale-110 transition-transform"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="font-bold text-lg text-purple-700">{exp.position}</div>
              <div className="text-sm text-purple-500">{exp.company}</div>
              <div className="flex items-center gap-2 text-xs text-cyan-600 bg-cyan-100 rounded-full px-3 py-1 mt-1 mb-2">
                <Calendar className="w-3 h-3" />
                {exp.duration}
              </div>
              {exp.location && (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 rounded-full px-3 py-1 mb-2">
                  <MapPin className="w-3 h-3" />
                  {exp.location}
                </div>
              )}
              <div className="text-gray-700 text-base">{exp.description}</div>
              {exp.achievements && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-600 mb-1">Achievements:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {exp.achievements.split('|').map((achievement, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-pink-500">•</span>
                        <span>{achievement.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-auto border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Experience</h4>
                    <p className="text-gray-500 text-sm">Manage your work experience and projects</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter job title"
                />
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleInput}
                    onFocus={() => setShowCompanyDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                    placeholder="Enter company name or select from existing"
                  />
                  
                  {/* Dropdown Arrow */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Dropdown Options */}
                  {showCompanyDropdown && uniqueCompanies.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                      {uniqueCompanies.map((company, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setForm(f => ({ ...f, company }));
                            setShowCompanyDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="text-gray-700 font-medium">{company}</div>
                          <div className="text-xs text-gray-500">Existing company</div>
                        </button>
                      ))}
                      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                        Or type a new company name above
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-200"
                  placeholder="e.g., 2022 - Present"
                />
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleInput}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200 pl-10"
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Enter job description and responsibilities"
                />
              </div>

              {/* Technologies Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter technologies (e.g., React, Node.js, Python)"
                />
              </div>

              {/* Achievements Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements
                </label>
                <div className="space-y-2">
                  {form.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-200"
                        placeholder={`Achievement ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="px-3 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="w-full px-4 py-3 border-2 border-dashed border-pink-300 rounded-xl text-pink-600 hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
              </div>

              {/* Order Index Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order_index"
                  value={form.order_index}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-cyan-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter display order (0 = first)"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleInput}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active (visible on frontend)
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Experience
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 