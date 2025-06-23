import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Award as AwardIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { getAwards, createAward, updateAward, deleteAward } from '../../services/api';

const emptyForm = {
  title: '',
  organization: '',
  year: '',
  icon: '🏆',
  order_index: 0,
};

export default function AdminAwards() {
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
      const data = await getAwards();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to fetch awards. The backend might be down.');
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
        await updateAward(editingId, form);
      } else {
        await createAward(form);
      }
      setShowForm(false);
      fetchItems();
    } catch {
      setError('Failed to save award');
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this award?')) return;
    
    try {
      await deleteAward(id);
      fetchItems();
    } catch (e) {
      console.error('Error deleting award:', e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-yellow-800 flex items-center gap-2"><AwardIcon /> Awards</h3>
        <button onClick={startAdd} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all">+ Add</button>
      </div>
      {loading ? (
        <div className="text-yellow-500 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col gap-2 relative border-2 border-yellow-100 hover:shadow-2xl transition-all">
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
              <div className="font-bold text-lg text-yellow-700">{item.title}</div>
              <div className="text-sm text-yellow-600">{item.organization}</div>
              <div className="text-xs text-orange-600 bg-orange-100 rounded-full px-3 py-1 mt-1 mb-2 self-start">{item.year}</div>
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
                <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Award</h4>
                <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <input name="title" value={form.title} onChange={handleInput} placeholder="Award Title" required className="w-full p-2 border rounded"/>
                <input name="organization" value={form.organization} onChange={handleInput} placeholder="Organization" required className="w-full p-2 border rounded"/>
                <input name="year" value={form.year} onChange={handleInput} placeholder="Year" required className="w-full p-2 border rounded"/>
                <input name="icon" value={form.icon} onChange={handleInput} placeholder="Icon (emoji)" className="w-full p-2 border rounded"/>
              </div>
               <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-yellow-500 text-white">Save</button>
              </div>
          </form>
        </div>
      )}
    </div>
  );
} 