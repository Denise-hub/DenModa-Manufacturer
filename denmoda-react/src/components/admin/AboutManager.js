import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';
import ImageUploader from './ImageUploader';

const AboutManager = () => {
  const { about, refreshAbout } = useData();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: 'Who are we?',
    subtitle: 'DenModa is a local handmade shoe industry.',
    description: '',
    image: '',
    imagePublicId: '',
    features: ['', '', '']
  });

  useEffect(() => {
    if (about) {
      setForm({
        title: about.title || 'Who are we?',
        subtitle: about.subtitle || 'DenModa is a local handmade shoe industry.',
        description: about.description || '',
        image: about.image || '',
        imagePublicId: about.imagePublicId || '',
        features: about.features || ['', '', '']
      });
    }
  }, [about]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await firestoreService.updateAbout({
        ...form,
        features: form.features.filter(f => f.trim() !== '')
      });
      await refreshAbout();
      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error saving about section:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = ({ url, publicId }) => {
    setForm({
      ...form,
      image: url,
      imagePublicId: publicId
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
    setForm({ ...form, features: newFeatures });
  };

  return (
    <div className="about-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>About Section</h2>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Subtitle</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Main description text..."
                ></textarea>
              </div>
            </div>
            <div className="col-md-6">
              <ImageUploader
                currentImage={form.image}
                onImageUploaded={handleImageUploaded}
                folder="denmoda/about"
                label="About Image"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Features List</label>
            {form.features.map((feature, index) => (
              <div key={index} className="input-group mb-2">
                <span className="input-group-text">
                  <i className="ri-check-double-line"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Feature description..."
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
            <button 
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={addFeature}
            >
              <i className="bi bi-plus"></i> Add Feature
            </button>
          </div>

          <hr />

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
                <i className="bi bi-check-lg me-1"></i> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;





