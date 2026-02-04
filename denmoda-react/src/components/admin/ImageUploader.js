import React, { useState, useRef, useEffect } from 'react';
import { uploadToCloudinary, isCloudinaryConfigured, getCloudinaryConfig } from '../../config/cloudinary';

/**
 * ImageUploader Component
 * Uploads media to Cloudinary and returns the URL for Firebase storage
 */
const ImageUploader = ({ 
  currentImage = '', 
  onImageUploaded, 
  folder = 'general',
  label = 'Upload Image',
  acceptVideo = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showSetupHelp, setShowSetupHelp] = useState(false);
  const fileInputRef = useRef(null);

  // Check Cloudinary configuration
  const cloudinaryReady = isCloudinaryConfigured();
  const config = getCloudinaryConfig();

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const acceptedTypes = acceptVideo 
    ? 'image/*,video/*' 
    : 'image/*';

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setError('');
    setProgress(0);

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    if (!acceptVideo && isVideo) {
      setError('Video upload is not allowed for this field');
      return;
    }

    // Validate file size (10MB for images, 100MB for videos)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File too large. Max size: ${isVideo ? '100MB' : '10MB'}`);
      return;
    }

    // Check Cloudinary config
    if (!cloudinaryReady) {
      setError('Cloudinary not configured. Please set up your .env file.');
      setShowSetupHelp(true);
      return;
    }

    setUploading(true);
    setProgress(10);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setProgress(30);

    try {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, folder);
      
      setProgress(100);
      setPreview(result.url);
      setError('');
      
      // Callback with result - URL will be saved to Firebase
      onImageUploaded({
        url: result.url,
        publicId: result.publicId,
        type: result.type
      });

    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed');
      setPreview(currentImage);
      
      // Show setup help if it's a configuration issue
      if (err.message?.includes('preset') || err.message?.includes('Cloud Name')) {
        setShowSetupHelp(true);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setError('');
    onImageUploaded({ url: '', publicId: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-uploader mb-3">
      <label className="form-label fw-semibold">{label}</label>
      
      {/* Cloudinary Status */}
      <div className="mb-2">
        {cloudinaryReady ? (
          <small className="text-success">
            <i className="bi bi-check-circle me-1"></i>
            Cloudinary connected ({config.cloudName})
          </small>
        ) : (
          <small className="text-warning">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Cloudinary not configured - 
            <button 
              type="button" 
              className="btn btn-link btn-sm p-0 ms-1"
              onClick={() => setShowSetupHelp(true)}
            >
              Setup Guide
            </button>
          </small>
        )}
      </div>

      {/* Setup Help Modal */}
      {showSetupHelp && (
        <div className="alert alert-info mb-3" style={{ fontSize: '0.85rem' }}>
          <div className="d-flex justify-content-between align-items-start">
            <h6 className="alert-heading mb-2">
              <i className="bi bi-cloud me-1"></i>
              Cloudinary Setup Guide
            </h6>
            <button 
              type="button" 
              className="btn-close btn-sm" 
              onClick={() => setShowSetupHelp(false)}
            ></button>
          </div>
          
          <ol className="mb-2 ps-3">
            <li>Go to <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noopener noreferrer">cloudinary.com</a> and sign up (free)</li>
            <li>From Dashboard, copy your <strong>Cloud Name</strong></li>
            <li>Go to <strong>Settings → Upload → Upload presets</strong></li>
            <li>Click <strong>"Add upload preset"</strong></li>
            <li>Set preset name to: <code>denmoda_uploads</code></li>
            <li><strong className="text-danger">⚠️ IMPORTANT:</strong> Set Signing Mode to <strong>UNSIGNED</strong></li>
            <li>Click <strong>Save</strong></li>
          </ol>
          
          <p className="mb-2">Add to your <code>.env</code> file:</p>
          <pre className="bg-dark text-light p-2 rounded" style={{ fontSize: '0.8rem' }}>
{`REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=denmoda_uploads`}
          </pre>
          
          <p className="mb-0 text-muted">
            <small>
              <i className="bi bi-arrow-clockwise me-1"></i>
              After updating .env, restart the app (Ctrl+C, then npm start)
            </small>
          </p>
        </div>
      )}

      {/* Upload Area */}
      <div className="upload-area">
        {preview ? (
          <div className="preview-container position-relative d-inline-block">
            {preview.includes('video') || preview.includes('.mp4') || preview.includes('.webm') ? (
              <video 
                src={preview} 
                className="rounded"
                style={{ maxHeight: '200px', maxWidth: '100%' }}
                controls
              />
            ) : (
              <img 
                src={preview} 
                alt="Preview" 
                className="rounded"
                style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/assets/denmoda.png'; }}
              />
            )}
            
            {/* Overlay with remove button */}
            <div 
              className="position-absolute top-0 end-0 p-1"
              style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '0 0.25rem 0 0.25rem' }}
            >
              <button 
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleRemove}
                disabled={uploading}
                title="Remove"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>

            {/* Upload progress overlay */}
            {uploading && (
              <div 
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '0.25rem' }}
              >
                <div className="text-center text-white">
                  <div className="spinner-border spinner-border-sm mb-2" role="status"></div>
                  <div><small>Uploading... {progress}%</small></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`dropzone d-flex flex-column align-items-center justify-content-center p-4 text-center ${!cloudinaryReady ? 'opacity-75' : ''}`}
            onClick={cloudinaryReady ? handleClick : () => setShowSetupHelp(true)}
            style={{ 
              minHeight: '150px', 
              cursor: 'pointer',
              border: `2px dashed ${cloudinaryReady ? '#0d6efd' : '#ffc107'}`,
              borderRadius: '10px',
              transition: 'all 0.3s',
              background: cloudinaryReady ? 'rgba(13, 110, 253, 0.05)' : 'rgba(255, 193, 7, 0.05)'
            }}
          >
            {uploading ? (
              <>
                <div className="spinner-border text-primary mb-2" role="status"></div>
                <span>Uploading to Cloudinary... {progress}%</span>
              </>
            ) : (
              <>
                <i className={`bi ${cloudinaryReady ? 'bi-cloud-arrow-up' : 'bi-exclamation-circle'} fs-1 mb-2`} 
                   style={{ color: cloudinaryReady ? '#0d6efd' : '#ffc107' }}></i>
                <span className={cloudinaryReady ? 'text-primary' : 'text-warning'}>
                  {cloudinaryReady ? 'Click to upload' : 'Click to setup Cloudinary'}
                </span>
                <small className="text-muted mt-1">
                  {acceptVideo ? 'Images or Videos' : 'Images only'} (max {acceptVideo ? '100MB' : '10MB'})
                </small>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="d-none"
      />

      {/* Change button when image exists */}
      {preview && !uploading && (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm mt-2"
          onClick={handleClick}
          disabled={!cloudinaryReady}
        >
          <i className="bi bi-arrow-repeat me-1"></i>
          Change {acceptVideo ? 'Media' : 'Image'}
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-danger mt-2 py-2 mb-0">
          <small>
            <i className="bi bi-x-circle me-1"></i>
            {error.split('\n').map((line, i) => (
              <span key={i}>{line}<br/></span>
            ))}
          </small>
        </div>
      )}

      {/* Success info */}
      {preview && preview.includes('cloudinary.com') && (
        <div className="mt-2">
          <small className="text-success">
            <i className="bi bi-check-circle me-1"></i>
            Uploaded to Cloudinary • URL saved to Firebase
          </small>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
