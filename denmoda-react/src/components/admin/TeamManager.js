import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';
import ImageUploader from './ImageUploader';

const TeamManager = () => {
  const { team, refreshTeam } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    description: '',
    image: '',
    imagePublicId: '',
    socialLinks: {
      whatsapp: '',
      facebook: '',
      linkedin: '',
      instagram: ''
    },
    order: 0,
    isActive: true
  });

  const handleEdit = (member) => {
    setEditing(member.id);
    setForm({
      name: member.name || '',
      role: member.role || '',
      description: member.description || '',
      image: member.image || '',
      imagePublicId: member.imagePublicId || '',
      socialLinks: member.socialLinks || {
        whatsapp: '',
        facebook: '',
        linkedin: '',
        instagram: ''
      },
      order: member.order || 0,
      isActive: member.isActive !== false
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      name: '',
      role: '',
      description: '',
      image: '',
      imagePublicId: '',
      socialLinks: {
        whatsapp: '',
        facebook: '',
        linkedin: '',
        instagram: ''
      },
      order: 0,
      isActive: true
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing === 'new') {
        await firestoreService.createTeamMember(form);
      } else {
        await firestoreService.updateTeamMember(editing, form);
      }
      await refreshTeam();
      handleCancel();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    
    setLoading(true);
    try {
      await firestoreService.deleteTeamMember(id);
      await refreshTeam();
    } catch (error) {
      console.error('Error deleting team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditing('new');
    setForm({
      name: '',
      role: '',
      description: '',
      image: '',
      imagePublicId: '',
      socialLinks: {
        whatsapp: '',
        facebook: '',
        linkedin: '',
        instagram: ''
      },
      order: team.length + 1,
      isActive: true
    });
  };

  const handleImageUploaded = ({ url, publicId }) => {
    setForm({ ...form, image: url, imagePublicId: publicId });
  };

  const handleSocialChange = (platform, value) => {
    setForm({
      ...form,
      socialLinks: { ...form.socialLinks, [platform]: value }
    });
  };

  return (
    <div className="team-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Team Members</h2>
        <button className="btn btn-primary" onClick={handleAddNew} disabled={editing}>
          <i className="bi bi-plus-lg me-1"></i> Add Member
        </button>
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editing === 'new' ? 'Add Team Member' : 'Edit Team Member'}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role / Position</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
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
              </div>
              <div className="col-md-6">
                <ImageUploader
                  currentImage={form.image}
                  onImageUploaded={handleImageUploaded}
                  folder="denmoda/team"
                  label="Profile Photo"
                />
              </div>
            </div>

            <h6 className="mt-3 mb-2">Social Links</h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="bi bi-whatsapp text-success me-1"></i> WhatsApp
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.socialLinks.whatsapp}
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                  placeholder="WhatsApp link..."
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="bi bi-facebook text-primary me-1"></i> Facebook
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.socialLinks.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="Facebook profile URL..."
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="bi bi-linkedin text-info me-1"></i> LinkedIn
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="LinkedIn profile URL..."
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <i className="bi bi-instagram text-danger me-1"></i> Instagram
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="Instagram profile URL..."
                />
              </div>
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
        {team.map((member, index) => (
          <div key={member.id || index} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex">
                <div className="me-3">
                  <img
                    src={member.image || '/img/team/team-1.jpg'}
                    alt={member.name}
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h5 className="mb-1">{member.name}</h5>
                  <p className="text-muted mb-1">{member.role}</p>
                  <small>{member.description}</small>
                </div>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(member)} disabled={editing}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(member.id)} disabled={editing || loading}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {team.length === 0 && !editing && (
        <div className="alert alert-info">
          No team members found. Click "Add Member" to create one.
        </div>
      )}
    </div>
  );
};

export default TeamManager;





