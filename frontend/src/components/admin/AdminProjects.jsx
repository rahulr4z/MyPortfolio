import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, FolderOpen, Github, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { getAdminProjects, createProject, updateProject, deleteProject } from '../../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    github_url: '',
    live_url: '',
    technologies: '',
    category: '',
    order_index: 0,
    is_active: true
  });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAdminProjects();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
        setLoading(false);
        setError('You are not authorized. Please log in.');
        return;
      }
    } catch {
      setProjects([]);
      setError('You are not authorized. Please log in.');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      if (editingId) {
        // Update existing project
        await updateProject(editingId, form);
      } else {
        // Create new project
        await createProject(form);
      }
      
      setFormOpen(false);
      setEditingId(null);
      fetchProjects();
      setFormSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        closeForm();
      }, 1000);
    } catch {
      setFormError('An error occurred while saving the project.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deleteProject(id);
      // Refresh the projects list to reflect the deletion
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      image_url: '',
      github_url: '',
      live_url: '',
      technologies: '',
      category: '',
      order_index: 0,
      is_active: true
    });
    setFormError(null);
    setFormSuccess(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
          <FolderOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-600">Manage your portfolio projects and showcase your work</p>
        </div>
      </div>

      {/* Add New Project Button */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={() => setFormOpen(true)}
        className="w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center gap-3 text-gray-700 hover:text-gray-900"
      >
        <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <span className="font-medium">Add New Project</span>
      </button>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                    {!project.is_active && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">Inactive</span>
                    )}
                    {project.category && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg font-medium">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Order: {project.order_index}</span>
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                        <ExternalLink className="w-4 h-4" />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingId(project.id);
                    setForm({
                      title: project.title,
                      description: project.description,
                      image_url: project.image_url || '',
                      github_url: project.github_url || '',
                      live_url: project.live_url || '',
                      technologies: project.technologies || '',
                      category: project.category || 'web',
                      order_index: project.order_index || 0,
                      is_active: project.is_active !== false
                    });
                    setFormOpen(true);
                  }}
                  className="p-2 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 hover:scale-105 transition-transform shadow text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 transition-transform shadow text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-auto border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Project</h4>
                    <p className="text-gray-500 text-sm">Manage your portfolio projects</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    closeForm();
                  }}
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
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter project title"
                />
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
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Enter project description"
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
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter technologies (e.g., React, Node.js, Python)"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Category <span className="text-red-500">*</span>
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter project category"
                />
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter project image URL"
                />
              </div>

              {/* Live URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live URL
                </label>
                <input
                  name="live_url"
                  value={form.live_url}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter live project URL"
                />
              </div>

              {/* GitHub URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub URL
                </label>
                <input
                  name="github_url"
                  value={form.github_url}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-200"
                  placeholder="Enter GitHub repository URL"
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
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
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
                disabled={formLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    Save Project
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

export default AdminProjects; 