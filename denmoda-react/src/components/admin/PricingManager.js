import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const PricingManager = () => {
  const { pricing, refreshPricing } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: '',
    price: 0,
    currency: '$',
    unit: 'Shoe',
    features: [''],
    isFeatured: false,
    badge: '',
    order: 0,
    isActive: true
  });

  const handleEdit = (price) => {
    setEditing(price.id);
    setForm({
      category: price.category || '',
      price: price.price || 0,
      currency: price.currency || '$',
      unit: price.unit || 'Shoe',
      features: price.features || [''],
      isFeatured: price.isFeatured || false,
      badge: price.badge || '',
      order: price.order || 0,
      isActive: price.isActive !== false
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      category: '',
      price: 0,
      currency: '$',
      unit: 'Shoe',
      features: [''],
      isFeatured: false,
      badge: '',
      order: 0,
      isActive: true
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = {
        ...form,
        features: form.features.filter(f => f.trim() !== '')
      };
      
      if (editing === 'new') {
        await firestoreService.createPricing(data);
      } else {
        await firestoreService.updatePricing(editing, data);
      }
      await refreshPricing();
      handleCancel();
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing plan?')) return;
    
    setLoading(true);
    try {
      await firestoreService.deletePricing(id);
      await refreshPricing();
    } catch (error) {
      console.error('Error deleting pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditing('new');
    setForm({
      category: '',
      price: 0,
      currency: '$',
      unit: 'Shoe',
      features: [''],
      isFeatured: false,
      badge: '',
      order: pricing.length + 1,
      isActive: true
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm({ ...form, features: newFeatures });
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: newFeatures.length ? newFeatures : [''] });
  };

  return (
    <div className="pricing-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pricing Plans</h2>
        <button className="btn btn-primary" onClick={handleAddNew} disabled={editing}>
          <i className="bi bi-plus-lg me-1"></i> Add Plan
        </button>
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editing === 'new' ? 'Add New Plan' : 'Edit Plan'}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g., Man, Woman, Child"
                />
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Currency</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Unit</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="e.g., Shoe, Pair"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Features</label>
              {form.features.map((feature, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Feature..."
                  />
                  <button 
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeFeature(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addFeature}>
                <i className="bi bi-plus"></i> Add Feature
              </button>
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Badge (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g., Popular, Others"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label d-block">Featured</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label d-block">Active</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
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
        {pricing.map((price, index) => (
          <div key={price.id || index} className="col-md-4 mb-4">
            <div className={`card h-100 ${price.isFeatured ? 'border-primary' : ''}`}>
              <div className={`card-header ${price.isFeatured ? 'bg-primary text-white' : ''}`}>
                <h5 className="mb-0">{price.category}</h5>
              </div>
              <div className="card-body text-center">
                <h2>
                  <sup>{price.currency}</sup>{price.price}
                  <small className="text-muted"> / {price.unit}</small>
                </h2>
                <ul className="list-unstyled">
                  {price.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(price)} disabled={editing}>
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(price.id)} disabled={editing || loading}>
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

export default PricingManager;





