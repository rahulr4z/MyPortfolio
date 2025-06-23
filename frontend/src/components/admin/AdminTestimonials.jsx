import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/api';

const emptyForm = {
  name: '',
  position: '',
  company: '',
  relation: '',
  message: '',
  order_index: 0,
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const data = await getTestimonials();
      if (Array.isArray(data)) {
        setTestimonials(data);
      } else {
        setTestimonials([]);
        setError('You are not authorized. Please log in.');
      }
    } catch {
      setTestimonials([]);
      setError('You are not authorized. Please log in.');
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(item) {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTestimonial(editingId, form);
      } else {
        await createTestimonial(form);
      }
      setShowForm(false);
      fetchTestimonials();
    } catch {
      setError('Failed to save testimonial');
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    
    try {
      await deleteTestimonial(id);
      fetchTestimonials();
    } catch (e) {
      console.error('Error deleting testimonial:', e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-purple-800 flex items-center gap-2">💬 Testimonials</h3>
        <button onClick={startAdd} className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all">+ Add</button>
      </div>
      {loading ? (
        <div className="text-purple-500 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col gap-2 relative border-2 border-purple-100 hover:shadow-2xl transition-all">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => startEdit(t)} className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow hover:scale-110 transition-transform"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col items-center mb-2">
                <div className="font-bold text-lg text-purple-700">{t.name}</div>
                <div className="text-sm text-purple-500">{t.position}{t.company ? `, ${t.company}` : ''}</div>
                <div className="text-xs text-pink-600 bg-pink-100 rounded-full px-3 py-1 mt-1">{t.relation}</div>
              </div>
              <blockquote className="italic text-gray-700 text-base">"{t.message}"</blockquote>
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
                  <span className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Testimonial</h4>
                    <p className="text-gray-500 text-sm">Manage your testimonials and reviews</p>
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
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter person's name"
                />
              </div>

              {/* Position Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter position (e.g., Senior Developer)"
                />
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter company name"
                />
              </div>

              {/* Relation Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation
                </label>
                <input
                  name="relation"
                  value={form.relation}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter relation (e.g., Former Manager, Client)"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInput}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Enter testimonial message"
                />
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
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
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
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Testimonial
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