import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Mail, Phone, MapPin, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import { getContactInfo, createContactInfo, updateContactInfo, deleteContactInfo } from '../../services/api';

const initialForm = {
  type: '',
  value: '',
  label: '',
  order_index: 0
};

const contactTypes = [
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4 mr-1" /> },
  { value: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4 mr-1" /> },
  { value: 'address', label: 'Address', icon: <MapPin className="w-4 h-4 mr-1" /> },
  { value: 'website', label: 'Website', icon: <Globe className="w-4 h-4 mr-1" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Globe className="w-4 h-4 mr-1" /> },
  { value: 'github', label: 'GitHub', icon: <Globe className="w-4 h-4 mr-1" /> },
  { value: 'twitter', label: 'Twitter', icon: <Globe className="w-4 h-4 mr-1" /> },
  { value: 'other', label: 'Other', icon: <Mail className="w-4 h-4 mr-1" /> },
];

const AdminContact = () => {
  const [contactItems, setContactItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchContactItems();
  }, []);

  const fetchContactItems = async () => {
    setLoading(true);
    try {
      const data = await getContactInfo();
      if (Array.isArray(data)) {
        setContactItems(data);
      } else {
        setContactItems([]);
        setLoading(false);
        setFormError('You are not authorized. Please log in.');
        return;
      }
    } catch {
      setContactItems([]);
      setFormError('You are not authorized. Please log in.');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (item = null) => {
    setForm(item ? {
      type: item.type || 'email',
      value: item.value || '',
      label: item.label || '',
      is_active: item.is_active !== undefined ? item.is_active : true,
      order_index: item.order_index || 0,
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
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      if (editingId) {
        await updateContactInfo(editingId, form);
      } else {
        await createContactInfo(form);
      }
      
      setFormOpen(false);
      setEditingId(null);
      fetchContactItems();
      setFormSuccess(true);
      
      setTimeout(() => {
        closeForm();
      }, 1000);
    } catch {
      setFormError('An error occurred while saving the contact info.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact info?')) return;
    
    try {
      await deleteContactInfo(id);
      fetchContactItems();
    } catch (e) {
      console.error('Error deleting contact info:', e);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'phone': return <Phone className="w-5 h-5" />;
      case 'address': return <MapPin className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Contact Information</h2>
          <p className="text-slate-600">Manage your contact details and social media links</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium shadow hover:from-teal-600 hover:to-cyan-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {formError && (
          <div className="text-red-500 text-lg mb-4">{formError}</div>
        )}
        {contactItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl">
                {getIconForType(item.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-slate-800">{item.label}</h3>
                  <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-lg capitalize">{item.type}</span>
                  {!item.is_active && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">Inactive</span>
                  )}
                </div>
                <p className="text-slate-700 mb-1">{item.value}</p>
                <div className="text-sm text-slate-500">Order: {item.order_index}</div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => openForm(item)}
                className="p-2 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 hover:scale-105 transition-transform shadow text-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 transition-transform shadow text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-auto border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Contact Information</h4>
                    <p className="text-gray-500 text-sm">Manage your contact details and social media links</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{formError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl bg-gray-50 text-gray-600 focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-200"
                >
                  {contactTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  name="label"
                  value={form.label}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter label (e.g., Work Email, Personal Phone)"
                />
                {errors.label && <p className="mt-2 text-sm text-red-600">{errors.label}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Value <span className="text-red-500">*</span>
                </label>
                <input
                  name="value"
                  value={form.value}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter contact value (e.g., john@example.com, +1234567890)"
                />
                {errors.value && <p className="mt-2 text-sm text-red-600">{errors.value}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order_index"
                  value={form.order_index}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter display order (0 = first)"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleInput}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active (visible on frontend)
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : formSuccess ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Contact
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminContact; 