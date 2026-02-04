import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const ServicesManager = () => {
  const { services, refreshServices } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    icon: '',
    title: '',
    description: '',
    order: 0,
    isActive: true
  });

  const handleEdit = (service) => {
    setEditing(service.id);
    setForm({
      icon: service.icon || '',
      title: service.title || '',
      description: service.description || '',
      order: service.order || 0,
      isActive: service.isActive !== false
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ icon: '', title: '', description: '', order: 0, isActive: true });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing === 'new') {
        await firestoreService.createService(form);
      } else {
        await firestoreService.updateService(editing, form);
      }
      await refreshServices();
      handleCancel();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    setLoading(true);
    try {
      await firestoreService.deleteService(id);
      await refreshServices();
    } catch (error) {
      console.error('Error deleting service:', error);
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
      order: services.length + 1,
      isActive: true
    });
  };

  return (
    <div className="services-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Services</h2>
        <button className="btn btn-primary" onClick={handleAddNew} disabled={editing}>
          <i className="bi bi-plus-lg me-1"></i> Add Service
        </button>
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editing === 'new' ? 'Add New Service' : 'Edit Service'}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Icon (Bootstrap Icons)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g., bi-house, bi-book"
                />
                <small className="text-muted">
                  <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">
                    Browse Bootstrap Icons
                  </a>
                </small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                  <label className="form-check-label">{form.isActive ? 'Active' : 'Inactive'}</label>
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
        {services.map((service, index) => (
          <div key={service.id || index} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <i className={`${service.icon} fs-2`} style={{ color: '#58eecd' }}></i>
                  <div className="flex-grow-1">
                    <h5>{service.title}</h5>
                    <p className="text-muted small mb-0">{service.description}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(service)} disabled={editing}>
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(service.id)} disabled={editing || loading}>
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

export default ServicesManager;

