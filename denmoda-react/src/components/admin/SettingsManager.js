import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';
import ImageUploader from './ImageUploader';
import { 
  DEFAULT_HERO_SLIDES, 
  DEFAULT_ICON_BOXES, 
  DEFAULT_SERVICES, 
  DEFAULT_PRICING,
  DEFAULT_FAQS 
} from '../../models';

const SettingsManager = () => {
  const { siteSettings, refreshSiteSettings, refreshAllData } = useData();
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [form, setForm] = useState({
    siteName: 'DenModa',
    tagline: 'Manufacturer',
    logo: '',
    logoPublicId: '',
    heroBackground: '',
    heroBackgroundPublicId: '',
    footerLogo: '',
    footerLogoPublicId: '',
    footerAbout: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  useEffect(() => {
    if (siteSettings) {
      setForm({
        siteName: siteSettings.siteName || 'DenModa',
        tagline: siteSettings.tagline || 'Manufacturer',
        logo: siteSettings.logo || '',
        logoPublicId: siteSettings.logoPublicId || '',
        heroBackground: siteSettings.heroBackground || '',
        heroBackgroundPublicId: siteSettings.heroBackgroundPublicId || '',
        footerLogo: siteSettings.footerLogo || '',
        footerLogoPublicId: siteSettings.footerLogoPublicId || '',
        footerAbout: siteSettings.footerAbout || '',
        seoTitle: siteSettings.seoTitle || '',
        seoDescription: siteSettings.seoDescription || '',
        seoKeywords: siteSettings.seoKeywords || ''
      });
    }
  }, [siteSettings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await firestoreService.updateSiteSettings(form);
      await refreshSiteSettings();
      alert('Site settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will add default data to your database. Existing data with the same IDs will be updated. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      await firestoreService.seedDatabase({
        heroSlides: DEFAULT_HERO_SLIDES,
        iconBoxes: DEFAULT_ICON_BOXES,
        services: DEFAULT_SERVICES,
        pricing: DEFAULT_PRICING,
        faqs: DEFAULT_FAQS,
        about: {
          title: 'Who are we?',
          subtitle: 'DenModa is a local handmade shoe industry.',
          description: "We offer goods and services. We care about our customers' satisfaction. Once you buy with us, you would never be disappointed. Let us serve you the way you deserve.",
          features: [
            "Hand-sewn women's sandal with thread",
            "Men's leather sandal",
            "And any type of model proposed by a customer"
          ]
        },
        contact: {
          address: 'N28 Kyeshero Q, Goma, RDC',
          email: 'denmoda.manufacturing@gmail.com',
          whatsapp: '254798257117',
          facebook: 'https://web.facebook.com/profile.php?id=100078174605745',
          youtube: 'https://www.youtube.com/channel/UCAfg9CgYWE5dCaay8GcGtsA/',
          linkedin: 'https://www.linkedin.com/company/denmoda/'
        }
      });

      await refreshAllData();
      alert('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Failed to seed database. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };

  const handleImageUploaded = (field, publicIdField) => ({ url, publicId }) => {
    setForm({
      ...form,
      [field]: url,
      [publicIdField]: publicId
    });
  };

  return (
    <div className="settings-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Site Settings</h2>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* General Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">General Settings</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.siteName}
                    onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tagline</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Footer About Text</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.footerAbout}
                  onChange={(e) => setForm({ ...form, footerAbout: e.target.value })}
                  placeholder="Short description for footer..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">SEO Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">SEO Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  placeholder="Page title for search engines"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">SEO Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  placeholder="Meta description for search engines"
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">SEO Keywords</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.seoKeywords}
                  onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Images</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ImageUploader
                    currentImage={form.heroBackground}
                    onImageUploaded={handleImageUploaded('heroBackground', 'heroBackgroundPublicId')}
                    folder="denmoda/settings"
                    label="Hero Background"
                  />
                </div>
                <div className="col-md-6">
                  <ImageUploader
                    currentImage={form.footerLogo}
                    onImageUploaded={handleImageUploaded('footerLogo', 'footerLogoPublicId')}
                    folder="denmoda/settings"
                    label="Footer Logo"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg" 
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
                <i className="bi bi-check-lg me-1"></i> Save All Settings
              </>
            )}
          </button>
        </div>

        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-outline-primary w-100 mb-2"
                onClick={handleSeedDatabase}
                disabled={seeding}
              >
                {seeding ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Seeding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-database-add me-1"></i>
                    Seed Database with Defaults
                  </>
                )}
              </button>
              <small className="text-muted d-block mt-2">
                This will populate the database with default content from the original HTML site.
              </small>
            </div>
          </div>

          {/* Info */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Information</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-1"></i>
                  Firebase Connected
                </li>
                <li className="mb-2">
                  <i className="bi bi-cloud text-primary me-1"></i>
                  Cloudinary for Images
                </li>
                <li>
                  <i className="bi bi-shield-check text-info me-1"></i>
                  Admin: {process.env.REACT_APP_ADMIN_EMAIL || 'denmoda.manufacturing@gmail.com'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;




