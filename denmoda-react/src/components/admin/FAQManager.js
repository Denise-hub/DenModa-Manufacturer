import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const FAQManager = () => {
  const { faqs, refreshFaqs } = useData();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    question: '',
    answer: '',
    order: 0,
    isActive: true
  });

  const handleEdit = (faq) => {
    setEditing(faq.id);
    setForm({
      question: faq.question || '',
      answer: faq.answer || '',
      order: faq.order || 0,
      isActive: faq.isActive !== false
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ question: '', answer: '', order: 0, isActive: true });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing === 'new') {
        await firestoreService.createFAQ(form);
      } else {
        await firestoreService.updateFAQ(editing, form);
      }
      await refreshFaqs();
      handleCancel();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    setLoading(true);
    try {
      await firestoreService.deleteFAQ(id);
      await refreshFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditing('new');
    setForm({
      question: '',
      answer: '',
      order: faqs.length + 1,
      isActive: true
    });
  };

  return (
    <div className="faq-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Frequently Asked Questions</h2>
        <button className="btn btn-primary" onClick={handleAddNew} disabled={editing}>
          <i className="bi bi-plus-lg me-1"></i> Add FAQ
        </button>
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editing === 'new' ? 'Add New FAQ' : 'Edit FAQ'}</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Question</label>
              <input
                type="text"
                className="form-control"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Enter the question..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Answer</label>
              <textarea
                className="form-control"
                rows="4"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Enter the answer..."
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
                <label className="form-label d-block">Active</label>
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

      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, index) => (
          <div key={faq.id || index} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#faq-${index}`}
              >
                <span className="me-2">
                  <i className="bi bi-question-circle text-primary"></i>
                </span>
                {faq.question}
                {!faq.isActive && <span className="badge bg-secondary ms-2">Inactive</span>}
              </button>
            </h2>
            <div id={`faq-${index}`} className="accordion-collapse collapse">
              <div className="accordion-body">
                <p>{faq.answer}</p>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(faq)} disabled={editing}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(faq.id)} disabled={editing || loading}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {faqs.length === 0 && !editing && (
        <div className="alert alert-info">
          No FAQs found. Click "Add FAQ" to create one.
        </div>
      )}
    </div>
  );
};

export default FAQManager;





