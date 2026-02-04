import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const HeroManager = () => {
  const { heroSlides, refreshHeroSlides } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    highlightText: '',
    description: '',
    order: 0,
    isActive: true
  });

  const handleEdit = (slide) => {
    setEditing(slide.id);
    setForm({
      title: slide.title || '',
      highlightText: slide.highlightText || '',
      description: slide.description || '',
      order: slide.order || 0,
      isActive: slide.isActive !== false
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      title: '',
      highlightText: '',
      description: '',
      order: 0,
      isActive: true
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing === 'new') {
        await firestoreService.createHeroSlide(form);
      } else {
        await firestoreService.updateHeroSlide(editing, form);
      }
      await refreshHeroSlides();
      handleCancel();
    } catch (error) {
      console.error('Error saving hero slide:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    setLoading(true);
    try {
      await firestoreService.deleteHeroSlide(id);
      await refreshHeroSlides();
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditing('new');
    setForm({
      title: '',
      highlightText: '',
      description: '',
      order: heroSlides.length + 1,
      isActive: true
    });
  };

  return (
    <div className="hero-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Hero Slides</h2>
        <button className="btn btn-primary" onClick={handleAddNew} disabled={editing}>
          <i className="bi bi-plus-lg me-1"></i> Add Slide
        </button>
      </div>

      {/* Form for editing/adding */}
      {editing && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editing === 'new' ? 'Add New Slide' : 'Edit Slide'}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Welcome at"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Highlight Text (colored)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.highlightText}
                  onChange={(e) => setForm({ ...form, highlightText: e.target.value })}
                  placeholder="e.g., DenModa"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Slide description..."
              ></textarea>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label d-block">Status</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <label className="form-check-label">
                    {form.isActive ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i> Save
                  </>
                )}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of slides */}
      <div className="list-group">
        {heroSlides.map((slide, index) => (
          <div key={slide.id || index} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">
                  {slide.title} {slide.highlightText && <span style={{ color: '#58eecd' }}>{slide.highlightText}</span>}
                </h5>
                <p className="mb-1 text-muted">{slide.description}</p>
                <small>
                  Order: {slide.order} | 
                  Status: <span className={slide.isActive !== false ? 'text-success' : 'text-danger'}>
                    {slide.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </small>
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleEdit(slide)}
                  disabled={editing}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(slide.id)}
                  disabled={editing || loading}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {heroSlides.length === 0 && !editing && (
        <div className="alert alert-info">
          No hero slides found. Click "Add Slide" to create one.
        </div>
      )}
    </div>
  );
};

export default HeroManager;





