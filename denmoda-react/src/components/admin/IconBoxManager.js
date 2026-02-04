import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const ICON_OPTIONS = [
  { value: 'bi-bag-dash', label: 'Shopping Bag' },
  { value: 'bx bx-alarm', label: 'Alarm' },
  { value: 'bx bx-message', label: 'Message' },
  { value: 'bx bx-happy', label: 'Happy Face' },
  { value: 'bi-house', label: 'House' },
  { value: 'bi-clock', label: 'Clock' },
  { value: 'bi-gear', label: 'Gear' },
  { value: 'bi-star', label: 'Star' },
  { value: 'bi-heart', label: 'Heart' },
  { value: 'bi-check-circle', label: 'Check Circle' }
];

const IconBoxManager = () => {
  const { iconBoxes, refreshIconBoxes } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    icon: '',
    title: '',
    description: '',
    link: '',
    order: 0,
    isActive: true
  });

  const handleEdit = (box) => {
    setEditing(box.id);
    setForm({
      icon: box.icon || '',
      title: box.title || '',
      description: box.description || '',
      link: box.link || '',
      order: box.order || 0,
      isActive: box.isActive !== false
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      icon: '',
      title: '',
      description: '',
      link: '',
      order: 0,
      isActive: true
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing === 'new') {
        await firestoreService.createIconBox(form);
      } else {
        await firestoreService.updateIconBox(editing, form);
      }
      await refreshIconBoxes();
      handleCancel();
    } catch (error) {
      console.error('Error saving icon box:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this icon box?')) return;
    
    setLoading(true);
    try {
      await firestoreService.deleteIconBox(id);
      await refreshIconBoxes();
    } catch (error) {
      console.error('Error deleting icon box:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditing('new');
    setForm({
      icon: 'bi-star',
      title: '',
      description: '',
      link: '',
      order: iconBoxes.length + 1,
      isActive: true
    });
  };

  return (
    <div className="iconbox-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Icon Boxes</h2>
        <button className="btn btn-primary" onClick={handleAddNew} disabled={editing}>
          <i className="bi bi-plus-lg me-1"></i> Add Icon Box
        </button>
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editing === 'new' ? 'Add New Icon Box' : 'Edit Icon Box'}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Icon</label>
                <select
                  className="form-select"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                >
                  <option value="">Select Icon</option>
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <small className="text-muted">Or enter custom icon class:</small>
                <input
                  type="text"
                  className="form-control form-control-sm mt-1"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g., bi-star or bx bx-star"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Box title"
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
                placeholder="Box description..."
              ></textarea>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Link (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="#section or URL"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-md-4 mb-3">
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
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {iconBoxes.map((box, index) => (
          <div key={box.id || index} className="col-md-6 col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className={`${box.icon} fs-1 mb-2`} style={{ color: '#bcdb33' }}></i>
                <h5>{box.title}</h5>
                <p className="small text-muted">{box.description}</p>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-center gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(box)} disabled={editing}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(box.id)} disabled={editing || loading}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconBoxManager;





