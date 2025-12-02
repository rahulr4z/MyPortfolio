import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, User, Brain, Rocket, Lightbulb, Loader2, CheckCircle2, GripVertical, RefreshCw } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAdminAbout, createAbout, updateAboutContent, deleteAbout, updateAboutOrder } from '../../services/api';
import { useApiData, useApiMutation } from '../../hooks/useApiData';

const initialForm = {
  title: '',
  subtitle: '',
  description: '',
};

const fieldMeta = {
  title: {
    label: 'Title',
    placeholder: 'Who I Am',
    helper: 'Card title, e.g. Who I Am, What I Do, etc.',
    required: true,
  },
  subtitle: {
    label: 'Subtitle',
    placeholder: 'Passionate Product Manager',
    helper: 'A subtitle that appears below the title.',
    required: false,
  },
  description: {
    label: 'Description',
    placeholder: 'Describe this aspect...',
    helper: 'A short description about this aspect of your personality or work.',
    required: true,
  },
};

const validate = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  return errors;
};

// Sortable Item Component
const SortableItem = ({ item, index, onEdit, onDelete, getCardIcon, getCardColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-10' : ''}`}
    >
      <div
        className={`h-full p-6 rounded-2xl bg-gradient-to-br ${getCardColor(index)} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-white/70" />
        </div>

        {/* Icon */}
        <div className="mb-4">
          {getCardIcon(index)}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
        {item.subtitle && (
          <p className="text-white/80 text-sm mb-3">{item.subtitle}</p>
        )}
        <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>

        {/* Actions */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminAbout = () => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use custom hooks for data management
  const { 
    data: aboutItemsData, 
    loading, 
    error, 
    refresh, 
    optimisticUpdate 
  } = useApiData(getAdminAbout, true);

  // Initialize aboutItems as empty array if data is null
  const aboutItems = aboutItemsData || [];

  const createMutation = useApiMutation(createAbout);
  const updateMutation = useApiMutation(updateAboutContent);
  const deleteMutation = useApiMutation(deleteAbout);
  const orderMutation = useApiMutation(updateAboutOrder);

  const openForm = (item = null) => {
    setForm(item ? {
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
    } : initialForm);
    setEditingId(item ? item.id : null);
    setErrors({});
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    createMutation.reset();
    updateMutation.reset();
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

    try {
      if (editingId) {
        await updateMutation.execute(editingId, form);
      } else {
        await createMutation.execute(form);
      }
      
      // Optimistic update
      optimisticUpdate(prevData => {
        if (editingId) {
          return prevData.map(item => 
            item.id === editingId ? { ...item, ...form } : item
          );
        } else {
          // For new items, we'll refresh to get the actual data with ID
          return prevData;
        }
      });

      setTimeout(() => {
        closeForm();
        refresh(); // Refresh to get updated data
      }, 900);
    } catch (err) {
      // Error is handled by the mutation hook
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Optimistic update
      optimisticUpdate(prevData => prevData.filter(item => item.id !== id));
      
      await deleteMutation.execute(id);
      refresh(); // Refresh to ensure consistency
    } catch {
      // If delete fails, refresh to restore the item
      refresh();
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = aboutItems.findIndex(item => item.id.toString() === active.id);
      const newIndex = aboutItems.findIndex(item => item.id.toString() === over.id);

      const newItems = arrayMove(aboutItems, oldIndex, newIndex);

      const updatedOrder = newItems.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    // Optimistic update
      optimisticUpdate(() => newItems);

    try {
      await orderMutation.execute(updatedOrder);
    } catch (err) {
      console.error("Failed to update order", err);
      // Revert on error
      refresh();
      }
    }
  };

  const getCardIcon = (index) => {
    const icons = [
      <Brain className="w-5 h-5 text-white" />,
      <Rocket className="w-5 h-5 text-white" />,
      <Lightbulb className="w-5 h-5 text-white" />
    ];
    return icons[index] || <User className="w-5 h-5 text-white" />;
  };

  const getCardColor = (index) => {
    const colors = [
      'from-blue-600 to-cyan-600',
      'from-green-600 to-emerald-600',
      'from-purple-600 to-pink-600'
    ];
    return colors[index] || 'from-gray-600 to-slate-600';
  };

  // Show loading state
  if (loading && aboutItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading about section...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">About Section</h2>
          <p className="text-slate-600">Manage your three main about cards: Who I Am, What I Do, What Interests Me</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => openForm()}
            disabled={aboutItems.length >= 3}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add New Card
          </button>
        </div>
      </div>

      {/* About Items List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={aboutItems.map(item => item.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutItems.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                onEdit={openForm}
                onDelete={handleDelete}
                getCardIcon={getCardIcon}
                getCardColor={getCardColor}
              />
              ))}
            </div>
        </SortableContext>
      </DndContext>

      {/* Form Modal */}
      {formOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit About Card' : 'Add New About Card'}
              </h3>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.entries(fieldMeta).map(([fieldName, meta]) => (
                <div key={fieldName}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {meta.label}
                    {meta.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    name={fieldName}
                    value={form[fieldName]}
                    onChange={handleInput}
                    placeholder={meta.placeholder}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors[fieldName] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors[fieldName] && (
                    <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{meta.helper}</p>
                </div>
              ))}

              {/* Error Display */}
              {(createMutation.error || updateMutation.error) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    {createMutation.error || updateMutation.error}
                  </p>
                </div>
              )}

              {/* Success Display */}
              {(createMutation.success || updateMutation.success) && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-green-600 text-sm">
                      {editingId ? 'About card updated successfully!' : 'About card created successfully!'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.loading || updateMutation.loading}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(createMutation.loading || updateMutation.loading) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout; 