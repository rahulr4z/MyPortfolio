import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Globe, RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import { getAdminBlogs, createBlog, updateBlog, deleteBlog, refreshBlogMetadata } from '../../services/api';

const initialForm = {
  url: '',
  order_index: 0,
  is_active: true
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [refreshingId, setRefreshingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminBlogs();
      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setFormError('Failed to load blogs. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (blog = null) => {
    setForm(blog ? {
      url: blog.url || '',
      order_index: blog.order_index || 0,
      is_active: blog.is_active !== undefined ? blog.is_active : true,
    } : initialForm);
    setEditingId(blog ? blog.id : null);
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setFormError(null);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      if (editingId) {
        await updateBlog(editingId, form);
      } else {
        await createBlog(form);
      }

      setFormOpen(false);
      setEditingId(null);
      fetchBlogs();
    } catch (error) {
      setFormError(error.message || 'An error occurred while saving the blog.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog entry?')) return;
    
    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleRefreshMetadata = async (id) => {
    setRefreshingId(id);
    try {
      await refreshBlogMetadata(id);
      fetchBlogs();
    } catch (error) {
      console.error('Error refreshing metadata:', error);
      alert('Failed to refresh metadata');
    } finally {
      setRefreshingId(null);
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
        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Blog Management</h2>
          <p className="text-slate-600">Manage your blog links and display order</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Blog
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {formError && (
          <div className="text-red-500 text-lg mb-4">{formError}</div>
        )}
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {blog.thumbnail && (
                    <img 
                      src={blog.thumbnail} 
                      alt={blog.title || 'Blog thumbnail'} 
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-800">{blog.title || 'Untitled'}</h3>
                      {!blog.is_active && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">Inactive</span>
                      )}
                    </div>
                    <a 
                      href={blog.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                    >
                      {blog.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {blog.description && (
                      <p className="text-slate-600 text-sm mt-2 line-clamp-2">{blog.description}</p>
                    )}
                    <div className="text-sm text-slate-500 mt-2">Order: {blog.order_index}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleRefreshMetadata(blog.id)}
                  disabled={refreshingId === blog.id}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all disabled:opacity-50"
                  title="Refresh metadata"
                >
                  {refreshingId === blog.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openForm(blog)}
                  className="p-2 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:scale-105 transition-transform shadow text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 transition-transform shadow text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-auto border border-gray-100"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Blog</h4>
                    <p className="text-gray-500 text-sm">Add a blog URL and metadata will be fetched automatically</p>
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
                  Blog URL <span className="text-red-500">*</span>
                </label>
                <input
                  name="url"
                  type="url"
                  value={form.url}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-200"
                  placeholder="https://example.com/blog/post"
                />
                <p className="text-xs text-gray-500 mt-1">Metadata (title, thumbnail, description) will be fetched automatically</p>
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
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
                  placeholder="0"
                />
              </div>

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

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Blog
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

export default AdminBlogs;

