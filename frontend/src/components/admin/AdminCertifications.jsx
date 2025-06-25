import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Award as AwardIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../../services/api';

const emptyForm = {
  name: '',
  issuer: '',
  year: '',
  icon: '📜',
  certificate_link: '',
  certificate_id: '',
  order_index: 0,
};

export default function AdminCertifications() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const data = await getCertifications();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to fetch certifications. The backend might be down.');
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
        await updateCertification(editingId, form);
      } else {
        await createCertification(form);
      }
      setShowForm(false);
      fetchItems();
    } catch {
      setError('Failed to save certification');
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    
    try {
      await deleteCertification(id);
      fetchItems();
    } catch (e) {
      console.error('Error deleting certification:', e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-green-800 flex items-center gap-2"><AwardIcon /> Certifications</h3>
        <button onClick={startAdd} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all">+ Add</button>
      </div>
      {loading ? (
        <div className="text-green-500 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col gap-2 relative border-2 border-green-100 hover:shadow-2xl transition-all">
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow hover:scale-110 transition-transform"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-5xl">{item.icon}</div>
              <div className="font-bold text-lg text-green-700">{item.name}</div>
              <div className="text-sm text-green-600">{item.issuer}</div>
              <div className="text-xs text-emerald-600 bg-emerald-100 rounded-full px-3 py-1 mt-1 mb-2 self-start">{item.year}</div>
              {item.certificate_link && (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100 rounded-full px-3 py-1 self-start">
                  <span>🔗</span>
                  <a href={item.certificate_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    View Certificate
                  </a>
                </div>
              )}
              {item.certificate_id && !item.certificate_link && (
                <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-100 rounded-full px-3 py-1 self-start">
                  <span>🆔</span>
                  <span>ID: {item.certificate_id}</span>
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
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg"
          >
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Certification</h4>
                <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <input name="name" value={form.name} onChange={handleInput} placeholder="Certification Name" required className="w-full p-2 border rounded"/>
                <input name="issuer" value={form.issuer} onChange={handleInput} placeholder="Issuer" required className="w-full p-2 border rounded"/>
                <input name="year" value={form.year} onChange={handleInput} placeholder="Year" required className="w-full p-2 border rounded"/>
                <input name="icon" value={form.icon} onChange={handleInput} placeholder="Icon (emoji)" className="w-full p-2 border rounded"/>
                <input name="certificate_link" value={form.certificate_link} onChange={handleInput} placeholder="Certificate Link" className="w-full p-2 border rounded"/>
                <input name="certificate_id" value={form.certificate_id} onChange={handleInput} placeholder="Certificate ID" className="w-full p-2 border rounded"/>
              </div>
               <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white">Save</button>
              </div>
          </form>
        </div>
      )}
    </div>
  );
} 