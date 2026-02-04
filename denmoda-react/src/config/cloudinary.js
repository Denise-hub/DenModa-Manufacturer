/**
 * CLOUDINARY CONFIGURATION & UPLOAD HELPER
 * =========================================
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Go to https://cloudinary.com and sign up (free)
 * 2. After login, you'll see your Dashboard with your Cloud Name
 * 3. Go to Settings (gear icon) → Upload → Upload presets
 * 4. Click "Add upload preset"
 * 5. Configure:
 *    - Preset name: denmoda_uploads (or any name you want)
 *    - Signing Mode: UNSIGNED (VERY IMPORTANT!)
 *    - Folder: denmoda (optional)
 * 6. Save the preset
 * 7. Add to your .env file:
 *    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
 *    REACT_APP_CLOUDINARY_UPLOAD_PRESET=denmoda_uploads
 * 8. Restart the app (npm start)
 */

// Get config from environment variables
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

// Cloudinary configuration validation
// Logs configuration status in development mode only
if (process.env.NODE_ENV === 'development') {
  console.log('Cloudinary Config:', {
    cloudName: CLOUD_NAME || 'NOT SET',
    uploadPreset: UPLOAD_PRESET || 'NOT SET',
    configured: Boolean(CLOUD_NAME && UPLOAD_PRESET)
  });
}

/**
 * Upload a file (image or video) to Cloudinary
 * 
 * @param {File} file - The file to upload
 * @param {string} folder - Folder name in Cloudinary (e.g., 'products', 'team')
 * @returns {Promise<{url: string, publicId: string, type: string}>}
 */
export const uploadToCloudinary = async (file, folder = 'general') => {
  // Validate configuration
  if (!CLOUD_NAME) {
    throw new Error(
      'Cloudinary Cloud Name not configured!\n\n' +
      'Add to your .env file:\n' +
      'REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name\n\n' +
      'Find your Cloud Name in Cloudinary Dashboard'
    );
  }

  if (!UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary Upload Preset not configured!\n\n' +
      'Add to your .env file:\n' +
      'REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset_name\n\n' +
      'Create an UNSIGNED upload preset in Cloudinary Settings → Upload'
    );
  }

  if (!file) {
    throw new Error('No file provided');
  }

  // Cloudinary upload URL
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `denmoda/${folder}`);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Cloudinary API Error:', data);
      }
      
      // Provide helpful error messages
      if (data.error?.message?.includes('Upload preset')) {
        throw new Error(
          `Upload preset "${UPLOAD_PRESET}" not found!\n\n` +
          'Please create it in Cloudinary:\n' +
          '1. Go to Settings → Upload → Upload presets\n' +
          '2. Click "Add upload preset"\n' +
          `3. Name it exactly: ${UPLOAD_PRESET}\n` +
          '4. Set Signing Mode to: UNSIGNED\n' +
          '5. Save and try again'
        );
      }
      
      if (data.error?.message?.includes('cloud_name')) {
        throw new Error(
          `Cloud Name "${CLOUD_NAME}" is invalid!\n\n` +
          'Check your Cloudinary Dashboard for the correct Cloud Name'
        );
      }
      
      throw new Error(data.error?.message || 'Upload failed');
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      type: data.resource_type,
      format: data.format,
      width: data.width,
      height: data.height,
      size: data.bytes
    };
  } catch (error) {
    // Re-throw error for proper error handling
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * Note: Deletion requires a signed request with API secret
 * This functionality would need to be implemented via a backend/cloud function
 * @param {string} publicId - Cloudinary public ID of the file to delete
 * @returns {Promise<boolean>} - Always returns true (placeholder)
 */
export const deleteFromCloudinary = async (publicId) => {
  // Placeholder for future implementation
  // Deletion requires backend implementation with API secret
  return true;
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transforms = `q_${quality},f_${format}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (width && height) transforms += ',c_fill';

  return url.replace('/upload/', `/upload/${transforms}/`);
};

/**
 * Check if Cloudinary is properly configured
 */
export const isCloudinaryConfigured = () => {
  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);
  if (!configured && process.env.NODE_ENV === 'development') {
    console.warn(
      'Cloudinary is not fully configured!\n' +
      'Missing:', 
      !CLOUD_NAME ? 'REACT_APP_CLOUDINARY_CLOUD_NAME' : '',
      !UPLOAD_PRESET ? 'REACT_APP_CLOUDINARY_UPLOAD_PRESET' : ''
    );
  }
  return configured;
};

/**
 * Get current configuration (for debugging)
 */
export const getCloudinaryConfig = () => ({
  cloudName: CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET,
  isConfigured: isCloudinaryConfigured()
});

const cloudinaryExports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
  isCloudinaryConfigured,
  getCloudinaryConfig,
  CLOUD_NAME,
  UPLOAD_PRESET
};

export default cloudinaryExports;
