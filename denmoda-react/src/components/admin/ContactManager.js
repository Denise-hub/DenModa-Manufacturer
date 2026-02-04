import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const ContactManager = () => {
  const { contact, refreshContact } = useData();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: '',
    email: '',
    phone: '',
    whatsapp: '',
    facebook: '',
    youtube: '',
    linkedin: '',
    instagram: ''
  });

  useEffect(() => {
    if (contact) {
      setForm({
        address: contact.address || '',
        email: contact.email || '',
        phone: contact.phone || '',
        whatsapp: contact.whatsapp || '',
        facebook: contact.facebook || '',
        youtube: contact.youtube || '',
        linkedin: contact.linkedin || '',
        instagram: contact.instagram || ''
      });
    }
  }, [contact]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await firestoreService.updateContact(form);
      await refreshContact();
      alert('Contact information updated successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contact Information</h2>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Basic Information</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-geo-alt me-1"></i> Address
              </label>
              <input
                type="text"
                className="form-control"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Physical address"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-envelope me-1"></i> Email
              </label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-telephone me-1"></i> Phone
              </label>
              <input
                type="text"
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
          </div>

          <hr />

          <h5 className="mb-3">Social Media Links</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-whatsapp text-success me-1"></i> WhatsApp
              </label>
              <input
                type="text"
                className="form-control"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="e.g., 254798257117 (phone number only)"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-facebook text-primary me-1"></i> Facebook
              </label>
              <input
                type="text"
                className="form-control"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="Facebook page URL"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-youtube text-danger me-1"></i> YouTube
              </label>
              <input
                type="text"
                className="form-control"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                placeholder="YouTube channel URL"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-linkedin text-info me-1"></i> LinkedIn
              </label>
              <input
                type="text"
                className="form-control"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="LinkedIn page URL"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="bi bi-instagram text-danger me-1"></i> Instagram
              </label>
              <input
                type="text"
                className="form-control"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="Instagram profile URL"
              />
            </div>
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

export default ContactManager;




