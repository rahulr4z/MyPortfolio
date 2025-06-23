import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, TrendingUp, Loader2, CheckCircle2, Award, GraduationCap, FileText, Wrench } from 'lucide-react';
import { getStats, createStat, updateStat, deleteStat } from '../../services/api';

const initialForm = {
  value: '',
  label: '',
  icon: '',
  type: 'main',
};

const fieldMeta = {
  value: {
    label: 'Number/Value',
    placeholder: '5+',
    helper: 'The statistic value (e.g., 5+, 100%, 24/7)',
    required: true,
  },
  label: {
    label: 'Label',
    placeholder: 'Years Experience',
    helper: 'Description of the statistic',
    required: true,
  },
  icon: {
    label: 'Icon/Emoji',
    placeholder: '⭐',
    helper: 'Choose an appropriate emoji for this stat',
    required: true,
  },
  type: {
    label: 'Type',
    helper: 'Choose the content type',
    required: true,
  },
};

const typeOptions = [
  { value: 'main', label: 'Main Stats', icon: <TrendingUp className="w-4 h-4 mr-1" /> },
  { value: 'award', label: 'Award', icon: <Award className="w-4 h-4 mr-1" /> },
  { value: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4 mr-1" /> },
  { value: 'certification', label: 'Certification', icon: <FileText className="w-4 h-4 mr-1" /> },
  { value: 'skill', label: 'Skill Category', icon: <Wrench className="w-4 h-4 mr-1" /> },
];

const validate = (form) => {
  const errors = {};
  if (!form.value.trim()) errors.value = 'Number/Value is required.';
  if (!form.label.trim()) errors.label = 'Label is required.';
  if (!form.icon.trim()) errors.icon = 'Icon/Emoji is required.';
  return errors;
};

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      if (Array.isArray(data)) {
        setStats(data);
      } else {
        setStats([]);
        setFormError('You are not authorized. Please log in.');
        return;
      }
    } catch {
      setStats([]);
      setFormError('You are not authorized. Please log in.');
    }
  };

  const openForm = (item = null) => {
    setForm(item ? {
      value: item.value || '',
      label: item.label || '',
      icon: item.icon || '',
      type: item.type || 'main',
    } : initialForm);
    setEditingId(item ? item.id : null);
    setFormError(null);
    setErrors({});
    setFormOpen(true);
    setFormSuccess(false);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setFormError(null);
    setErrors({});
    setFormSuccess(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    
    setFormLoading(true);
    setFormError(null);

    try {
      if (editingId) {
        await updateStat(editingId, form);
      } else {
        await createStat(form);
      }
      
      setFormOpen(false);
      setEditingId(null);
      fetchStats();
      setFormSuccess(true);
      
      setTimeout(() => {
        closeForm();
      }, 1000);
    } catch {
      setFormError('Failed to save. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    
    try {
      await deleteStat(id);
      fetchStats();
    } catch (e) {
      console.error('Error deleting stat:', e);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'main': return <TrendingUp className="w-5 h-5 text-white" />;
      case 'award': return <Award className="w-5 h-5 text-white" />;
      case 'education': return <GraduationCap className="w-5 h-5 text-white" />;
      case 'certification': return <FileText className="w-5 h-5 text-white" />;
      case 'skill': return <Wrench className="w-5 h-5 text-white" />;
      default: return <TrendingUp className="w-5 h-5 text-white" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'main': return 'from-green-600 to-teal-600';
      case 'award': return 'from-yellow-600 to-orange-600';
      case 'education': return 'from-blue-600 to-indigo-600';
      case 'certification': return 'from-green-600 to-emerald-600';
      case 'skill': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'main': return 'Main Stats';
      case 'award': return 'Award';
      case 'education': return 'Education';
      case 'certification': return 'Certification';
      case 'skill': return 'Skill Category';
      default: return type;
    }
  };

  const groupedStats = stats.reduce((acc, stat) => {
    if (!acc[stat.type]) {
      acc[stat.type] = [];
    }
    acc[stat.type].push(stat);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Statistics & Achievements</h2>
          <p className="text-slate-600">Manage your stats, awards, education, certifications, and skills</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow hover:from-green-600 hover:to-teal-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        </div>
      </div>

      {/* Stats by Type */}
      <div className="space-y-6">
        {formError && (
          <div className="text-red-500 text-lg mb-4">{formError}</div>
        )}
        
        {Object.keys(groupedStats).map((type) => (
          <div key={type} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-gradient-to-br ${getTypeColor(type)} rounded-lg`}>
                {getTypeIcon(type)}
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{getTypeLabel(type)}</h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                {groupedStats[type].length} items
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedStats[type].map((stat) => (
                <div
                  key={stat.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-lg font-bold text-slate-800">{stat.value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openForm(stat)}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(stat.id)}
                        className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                onClick={closeForm}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInput({ target: { name: 'type', value: option.value } })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        form.type === option.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 text-sm">
                        {option.icon}
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number/Value */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {fieldMeta.value.label} *
                </label>
                <input
                  type="text"
                  name="value"
                  value={form.value}
                  onChange={handleInput}
                  placeholder={fieldMeta.value.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.value ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {fieldMeta.label.label} *
                </label>
                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleInput}
                  placeholder={fieldMeta.label.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.label ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {fieldMeta.icon.label} *
                </label>
                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleInput}
                  placeholder={fieldMeta.icon.placeholder}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.icon ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-slate-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : formSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 