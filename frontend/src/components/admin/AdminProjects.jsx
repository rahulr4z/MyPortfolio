import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2, Layers, Link as LinkIcon, ArrowUpDown } from 'lucide-react';
import { 
  getAdminProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../../services/api';

const PROJECT_TYPES = [
  { value: 'impact', label: 'Impacts at work' },
  { value: 'external_case_study', label: 'External case study' },
  { value: 'product_skill', label: 'Product skills' },
  { value: 'redesign', label: 'Redesigns' },
  { value: 'article', label: 'Articles' },
];

const emptyForm = {
  id: null,
  projectType: 'impact',
  name: '',
  problem: '',
  action: '',
  result: '',
  caseType: '',
  description: '',
  productType: '',
  redesignProblem: '',
  redesignDescription: '',
  articleTitle: '',
  articleDescription: '',
  ctaUrl: '',
  order_index: 0,
  is_active: true,
};

// JSON wrapper key so we can detect the new schema
const PROJECT_SCHEMA_KEY = '__projectSchema';

const parseProjectFromApi = (project) => {
  const base = { ...emptyForm };
  base.id = project.id;
  base.order_index = project.order_index ?? 0;
  base.is_active = project.is_active ?? true;

  let parsed = null;
  if (project.description) {
    try {
      const maybeJson = JSON.parse(project.description);
      if (maybeJson && maybeJson[PROJECT_SCHEMA_KEY] === 'v2') {
        parsed = maybeJson;
      }
    } catch {
      // not JSON, ignore
    }
  }

  if (parsed) {
    const {
      projectType,
      name,
      problem,
      action,
      result,
      caseType,
      description,
      productType,
      redesignProblem,
      redesignDescription,
      articleTitle,
      articleDescription,
      ctaUrl,
    } = parsed;

    return {
      ...base,
      projectType: projectType || project.category || 'impact',
      name: name || project.title || '',
      problem: problem || '',
      action: action || '',
      result: result || '',
      caseType: caseType || '',
      description: description || '',
      productType: productType || '',
      redesignProblem: redesignProblem || '',
      redesignDescription: redesignDescription || '',
      articleTitle: articleTitle || project.title || '',
      articleDescription: articleDescription || '',
      ctaUrl: ctaUrl || project.live_url || '',
    };
  }

  // Fallback for legacy projects (non-JSON description)
  const type = project.category || 'impact';
  return {
    ...base,
    projectType: type,
    name: project.title || '',
    description: project.description || '',
    articleTitle: type === 'article' ? (project.title || '') : '',
    articleDescription: type === 'article' ? (project.short_description || project.description || '') : '',
    ctaUrl: project.live_url || '',
  };
};

const buildApiPayloadFromForm = (form) => {
  // Serialize type-specific data into JSON description
  const payloadJson = {
    [PROJECT_SCHEMA_KEY]: 'v2',
    projectType: form.projectType,
    name: form.name,
    problem: form.problem,
    action: form.action,
    result: form.result,
    caseType: form.caseType,
    description: form.description,
    productType: form.productType,
    redesignProblem: form.redesignProblem,
    redesignDescription: form.redesignDescription,
    articleTitle: form.articleTitle,
    articleDescription: form.articleDescription,
    ctaUrl: form.ctaUrl,
  };

  const common = {
    category: form.projectType,
    live_url: form.ctaUrl || null,
    order_index: Number(form.order_index) || 0,
    is_active: form.is_active,
  };

  switch (form.projectType) {
    case 'impact':
      return {
        ...common,
        title: form.name,
        description: JSON.stringify(payloadJson),
        short_description: form.result || '',
      };
    case 'external_case_study':
      return {
        ...common,
        title: form.name,
        description: JSON.stringify(payloadJson),
        short_description: form.description || '',
      };
    case 'product_skill':
      return {
        ...common,
        title: form.name,
        description: JSON.stringify(payloadJson),
        short_description: form.productType || '',
      };
    case 'redesign':
    case 'redesigns':
      return {
        ...common,
        category: 'redesign',
        title: form.name,
        description: JSON.stringify(payloadJson),
        short_description: form.redesignProblem || '',
      };
    case 'article':
      return {
        ...common,
        title: form.articleTitle || form.name,
        description: JSON.stringify(payloadJson),
        short_description: form.articleDescription || '',
      };
    default:
      return {
        ...common,
        title: form.name,
        description: JSON.stringify(payloadJson),
      };
  }
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProjects();
      const parsed = Array.isArray(data) ? data.map(parseProjectFromApi) : [];
      // sort by order_index ascending
      parsed.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      setProjects(parsed);
    } catch {
      setError('Failed to fetch projects. Please ensure you are logged in and backend is running.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...emptyForm,
      ...prev,
      projectType: value,
    }));
  };

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (project) => {
    setForm(project);
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = buildApiPayloadFromForm(form);
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      setShowForm(false);
      await fetchProjects();
    } catch {
      setError('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  };

  const handleReorder = (id, direction) => {
    setProjects((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const newProjects = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newProjects.length) return prev;
      const tempOrder = newProjects[index].order_index;
      newProjects[index].order_index = newProjects[targetIndex].order_index;
      newProjects[targetIndex].order_index = tempOrder;
      [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
      return newProjects;
    });
  };

  const projectTypeLabel = (type) => {
    const found = PROJECT_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  const renderTypeSpecificFields = () => {
    switch (form.projectType) {
      case 'impact':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400"
                placeholder="e.g., Reduced checkout drop-off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Problem</label>
              <textarea
                name="problem"
                value={form.problem}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl bg-gray-50 focus:outline-none focus:border-pink-400 resize-none"
                placeholder="What was broken or limiting?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <textarea
                name="action"
                value={form.action}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-gray-50 focus:outline-none focus:border-emerald-400 resize-none"
                placeholder="What did you do to solve it?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
              <textarea
                name="result"
                value={form.result}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-cyan-200 rounded-xl bg-gray-50 focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="What changed? (metrics, behaviours, outcomes)"
              />
            </div>
          </>
        );
      case 'external_case_study':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400"
                placeholder="e.g., Case study on onboarding experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input
                name="caseType"
                value={form.caseType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-400"
                placeholder="e.g., Fintech, SaaS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl bg-gray-50 focus:outline-none focus:border-teal-400 resize-none"
                placeholder="Short case summary"
              />
            </div>
          </>
        );
      case 'product_skill':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400"
                placeholder="e.g., Pricing experiment framework"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <input
                name="productType"
                value={form.productType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-gray-50 focus:outline-none focus:border-green-400"
                placeholder="e.g., Discovery, Prioritisation, Experimentation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl bg-gray-50 focus:outline-none focus:border-teal-400 resize-none"
                placeholder="How this demonstrates your product skill"
              />
            </div>
          </>
        );
      case 'redesign':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400"
                placeholder="e.g., Dashboard redesign"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Problem</label>
              <textarea
                name="redesignProblem"
                value={form.redesignProblem}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl bg-gray-50 focus:outline-none focus:border-rose-400 resize-none"
                placeholder="What wasn’t working in the old design?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="redesignDescription"
                value={form.redesignDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="What you changed and why"
              />
            </div>
          </>
        );
      case 'article':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="articleTitle"
                value={form.articleTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400"
                placeholder="e.g., How to run outcome-driven experiments"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="articleDescription"
                value={form.articleDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-gray-50 focus:outline-none focus:border-amber-400 resize-none"
                placeholder="Short summary of the article"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
          <Layers className="w-7 h-7" />
          Projects
        </h3>
        <button
          onClick={startAdd}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all"
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-indigo-500 text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading projects...
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-600">
          No projects yet. Click <span className="font-semibold">“Add Project”</span> to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col gap-3 relative border-2 border-indigo-100 hover:shadow-2xl transition-all"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleReorder(project.id, 'up')}
                  className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                  title="Move up"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startEdit(project)}
                  className="p-2 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow hover:scale-110 transition-transform"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs uppercase tracking-wide text-indigo-600 bg-indigo-50 inline-flex items-center gap-1 px-3 py-1 rounded-full self-start">
                <Layers className="w-3 h-3" />
                {projectTypeLabel(project.projectType)}
              </div>

              <div className="mt-2">
                <div className="font-bold text-lg text-gray-900">
                  {project.projectType === 'article'
                    ? project.articleTitle || project.name
                    : project.name || project.articleTitle}
                </div>
                {project.projectType === 'impact' && project.result && (
                  <div className="text-sm text-emerald-700 mt-1">
                    Result: <span className="font-medium">{project.result}</span>
                  </div>
                )}
                {project.projectType === 'external_case_study' && project.caseType && (
                  <div className="text-sm text-slate-600 mt-1">{project.caseType}</div>
                )}
                {project.projectType === 'product_skill' && project.productType && (
                  <div className="text-sm text-slate-600 mt-1">{project.productType}</div>
                )}
                {project.projectType === 'redesign' && project.redesignProblem && (
                  <div className="text-sm text-rose-700 mt-1">
                    Problem: <span className="font-medium">{project.redesignProblem}</span>
                  </div>
                )}
              </div>

              {project.ctaUrl && (
                <div className="mt-2 inline-flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full self-start">
                  <LinkIcon className="w-3 h-3" />
                  <span>Has live link</span>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Order: <span className="font-semibold">{project.order_index}</span>{' '}
                {project.is_active ? (
                  <span className="ml-2 inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    ● <span>Active</span>
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                    ● <span>Hidden</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </span>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {editingId ? 'Edit Project' : 'Add Project'}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Choose a project type and fill in the relevant fields.
                  </p>
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

            {error && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={form.projectType}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {renderTypeSpecificFields()}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  CTA: View link (optional)
                  <span className="text-xs text-gray-400">
                    Shown only if provided
                  </span>
                </label>
                <div className="relative">
                  <input
                    name="ctaUrl"
                    value={form.ctaUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400 pl-10"
                    placeholder="https:// or /case-studies/impact"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order_index"
                    value={form.order_index}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-cyan-200 rounded-xl bg-gray-50 focus:outline-none focus:border-cyan-400"
                    placeholder="0 = first"
                  />
                </div>
                <div className="flex items-center mt-6 md:mt-8 gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active (visible on frontend)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
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
}


