import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';
import ImageUploader from './ImageUploader';
import { PRODUCT_CATEGORIES } from '../../models';

const ProductsManager = () => {
  const { products, refreshAllProducts } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sizesInput, setSizesInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'man',
    image: '',
    imagePublicId: '',
    description: '',
    price: 0,
    sizes: [],
    orderLink: 'https://wa.me/254798257117',
    isNew: false,
    isFeatured: false,
    order: 0,
    isActive: true
  });
  
  // Fetch all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await refreshAllProducts();
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setInitialLoad(false);
      }
    };
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getCategoryLabel = (categoryValue) => {
    const cat = PRODUCT_CATEGORIES.find(c => c.value === categoryValue);
    return cat ? cat.label : categoryValue;
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    const sizes = product.sizes || [];
    setSizesInput(sizes.join(', '));
    setForm({
      title: product.title || '',
      category: product.category || 'man',
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
      description: product.description || '',
      price: product.price || 0,
      sizes: sizes,
      orderLink: product.orderLink || 'https://wa.me/254798257117',
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      order: product.order || 0,
      isActive: product.isActive !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditing(null);
    setSizesInput('');
    setForm({
      title: '',
      category: 'man',
      image: '',
      imagePublicId: '',
      description: '',
      price: 0,
      sizes: [],
      orderLink: 'https://wa.me/254798257117',
      isNew: false,
      isFeatured: false,
      order: 0,
      isActive: true
    });
  };

  const handleImageUpload = (result) => {
    setForm(prev => ({ 
      ...prev, 
      image: result.url, 
      imagePublicId: result.publicId 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setSuccessMessage('');
      return;
    }
    if (!form.image) {
      setSuccessMessage('');
      return;
    }
    
    setLoading(true);
    try {
      const sizesArray = sizesInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const productData = {
        ...form,
        sizes: sizesArray,
        price: parseFloat(form.price) || 0,
        order: parseInt(form.order) || 0
      };

      if (editing === 'new') {
        await firestoreService.createProduct(productData);
        setSuccessMessage('Product created successfully!');
      } else {
        await firestoreService.updateProduct(editing, productData);
        setSuccessMessage('Product updated successfully!');
      }
      await refreshAllProducts();
      handleCancel();
    } catch (error) {
      console.error('Error saving product:', error);
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setLoading(true);
    try {
      await firestoreService.deleteProduct(id);
      await refreshAllProducts();
      setSuccessMessage('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '12px 24px',
            backgroundColor: '#1a2b4b',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s ease'
          }}
        >
          <i className="bi bi-check-circle-fill" style={{ color: '#58eecd' }}></i>
          {successMessage}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-box-seam me-2" style={{ color: '#1a2b4b' }}></i>
          Products ({products?.length || 0})
        </h4>
        {!editing && (
          <button 
            className="btn text-white"
            style={{ backgroundColor: '#1a2b4b' }}
            onClick={() => {
              setEditing('new');
              handleCancel();
              setEditing('new');
            }}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add Product
          </button>
        )}
      </div>

      {/* Edit/Add Form */}
      {editing && (
        <div className="card mb-4 shadow-sm border-0" style={{ borderTop: '4px solid #1a2b4b' }}>
          <div className="card-header bg-white py-3">
            <h5 className="mb-0" style={{ color: '#1a2b4b' }}>
              <i className={`bi ${editing === 'new' ? 'bi-plus-circle' : 'bi-pencil-square'} me-2`}></i>
              {editing === 'new' ? 'Add New Product' : 'Edit Product'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price (USD)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Product Image *</label>
                  <ImageUploader
                    currentImage={form.image}
                    onImageUploaded={handleImageUpload}
                    folder="products"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="e.g., S, M, L, XL or 38, 39, 40, 41"
                  />
                  <small className="text-muted">Leave empty if not applicable</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">WhatsApp Order Link</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.orderLink}
                    onChange={(e) => setForm({ ...form, orderLink: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isNew"
                      checked={form.isNew}
                      onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isNew">Mark as New</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isFeatured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isFeatured">Featured</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isActive">Active</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button 
                  type="submit" 
                  className="btn text-white"
                  style={{ backgroundColor: '#1a2b4b' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i>
                      {editing === 'new' ? 'Create Product' : 'Update Product'}
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="row">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id || index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className={`card h-100 shadow-sm ${!product.isActive ? 'opacity-50' : ''}`}>
                <div className="position-relative">
                  <img
                    src={product.image || '/assets/denmoda.png'}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/denmoda.png'; }}
                  />
                  <span 
                    className="position-absolute top-0 start-0 badge m-2"
                    style={{ backgroundColor: '#1a2b4b' }}
                  >
                    {getCategoryLabel(product.category)}
                  </span>
                  <span 
                    className="position-absolute top-0 end-0 badge m-2"
                    style={{ backgroundColor: '#58eecd', color: '#1a2b4b' }}
                  >
                    ${product.price || 0}
                  </span>
                </div>
                <div className="card-body py-2">
                  <h6 className="card-title mb-1 text-truncate" title={product.title}>
                    {product.title || 'Untitled'}
                  </h6>
                  {product.sizes && product.sizes.length > 0 && (
                    <small className="text-muted">
                      <i className="bi bi-rulers me-1"></i>
                      {product.sizes.length} sizes
                    </small>
                  )}
                  <div className="mt-1">
                    {product.isNew && <span className="badge bg-warning text-dark me-1">New</span>}
                    {product.isFeatured && <span className="badge bg-info me-1">Featured</span>}
                    {!product.isActive && <span className="badge bg-secondary">Inactive</span>}
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 pt-0 pb-3">
                  <button 
                    type="button"
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: '#1a2b4b', color: 'white' }}
                    onClick={() => handleEdit(product)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button 
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                    onClick={() => handleDelete(product.id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !editing && (
            <div className="col-12">
              <div className="alert alert-info d-flex align-items-center">
                <i className="bi bi-info-circle fs-4 me-3"></i>
                <div>
                  <strong>No products found.</strong>
                  <p className="mb-0">Click "Add Product" to create your first product.</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsManager;
