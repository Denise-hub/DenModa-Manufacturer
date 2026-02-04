import React, { useState, useEffect } from 'react';
import { getCloudinaryConfig, uploadToCloudinary } from '../../config/cloudinary';

/**
 * CloudinarySetup Component
 * Helps admin verify and test Cloudinary configuration
 */
const CloudinarySetup = () => {
  const [config, setConfig] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setConfig(getCloudinaryConfig());
  }, []);

  const handleTestUpload = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Create a small test image (1x1 pixel PNG)
      const testBlob = await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
        .then(r => r.blob());
      
      const testFile = new File([testBlob], 'test-upload.png', { type: 'image/png' });
      
      const result = await uploadToCloudinary(testFile, 'test');
      
      setTestResult({
        success: true,
        message: 'Upload successful!',
        url: result.url
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="cloudinary-setup">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-cloud me-2"></i>
            Cloudinary Configuration
          </h5>
        </div>
        <div className="card-body">
          {/* Current Status */}
          <div className="mb-4">
            <h6>Current Status</h6>
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className={`badge ${config.isConfigured ? 'bg-success' : 'bg-warning'} fs-6`}>
                {config.isConfigured ? '✓ Configured' : '⚠ Not Configured'}
              </span>
            </div>
            <table className="table table-sm">
              <tbody>
                <tr>
                  <td><strong>Cloud Name:</strong></td>
                  <td>
                    {config.cloudName ? (
                      <code className="text-success">{config.cloudName}</code>
                    ) : (
                      <span className="text-danger">Not set</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td><strong>Upload Preset:</strong></td>
                  <td>
                    {config.uploadPreset ? (
                      <code className="text-success">{config.uploadPreset}</code>
                    ) : (
                      <span className="text-danger">Not set</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Test Upload */}
          <div className="mb-4">
            <h6>Test Connection</h6>
            <button 
              className="btn btn-primary"
              onClick={handleTestUpload}
              disabled={!config.isConfigured || testing}
            >
              {testing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Testing...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Test Upload
                </>
              )}
            </button>
            
            {testResult && (
              <div className={`alert mt-3 ${testResult.success ? 'alert-success' : 'alert-danger'}`}>
                {testResult.success ? (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {testResult.message}
                    <br />
                    <small className="text-muted">Test image: {testResult.url}</small>
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle me-2"></i>
                    {testResult.message.split('\n').map((line, i) => (
                      <span key={i}>{line}<br/></span>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="setup-guide">
            <h6>
              <i className="bi bi-book me-2"></i>
              Setup Instructions
            </h6>
            
            <div className="accordion" id="setupAccordion">
              {/* Step 1 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#step1">
                    Step 1: Create Cloudinary Account
                  </button>
                </h2>
                <div id="step1" className="accordion-collapse collapse show" data-bs-parent="#setupAccordion">
                  <div className="accordion-body">
                    <ol>
                      <li>Go to <a href="https://cloudinary.com/users/register_free" target="_blank" rel="noopener noreferrer">cloudinary.com</a></li>
                      <li>Sign up for a free account</li>
                      <li>Verify your email</li>
                      <li>Log in to your dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step2">
                    Step 2: Get Your Cloud Name
                  </button>
                </h2>
                <div id="step2" className="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                  <div className="accordion-body">
                    <ol>
                      <li>In Cloudinary Dashboard, look at the top of the page</li>
                      <li>Find <strong>"Cloud Name"</strong> (looks like: <code>dxyz123abc</code>)</li>
                      <li>Copy this value</li>
                    </ol>
                    <img 
                      src="https://res.cloudinary.com/demo/image/upload/v1/docs/cloudinary_dashboard_cloud_name.png" 
                      alt="Cloud Name Location"
                      className="img-fluid border rounded"
                      style={{ maxHeight: '200px' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 - MOST IMPORTANT */}
              <div className="accordion-item border-warning">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed text-danger" type="button" data-bs-toggle="collapse" data-bs-target="#step3">
                    ⚠️ Step 3: Create Upload Preset (IMPORTANT!)
                  </button>
                </h2>
                <div id="step3" className="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                  <div className="accordion-body bg-warning-subtle">
                    <div className="alert alert-danger">
                      <strong>This is the most common issue!</strong> The upload preset must be UNSIGNED.
                    </div>
                    <ol>
                      <li>Click the <strong>gear icon ⚙️</strong> (Settings) in top-right</li>
                      <li>Go to <strong>Upload</strong> tab</li>
                      <li>Scroll down to <strong>"Upload presets"</strong></li>
                      <li>Click <strong>"Add upload preset"</strong></li>
                      <li>Set <strong>Upload preset name</strong>: <code>denmoda_uploads</code></li>
                      <li className="text-danger fw-bold">
                        Set <strong>Signing Mode</strong>: <code>UNSIGNED</code>
                        <br/>
                        <small>(This is critical - Signed mode will NOT work!)</small>
                      </li>
                      <li>Optionally set Folder: <code>denmoda</code></li>
                      <li>Click <strong>Save</strong></li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step4">
                    Step 4: Update .env File
                  </button>
                </h2>
                <div id="step4" className="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                  <div className="accordion-body">
                    <p>Open <code>denmoda-react/.env</code> and add:</p>
                    <pre className="bg-dark text-light p-3 rounded">
{`REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=denmoda_uploads`}
                    </pre>
                    <p className="mb-0">
                      <strong>Example:</strong>
                    </p>
                    <pre className="bg-dark text-light p-3 rounded">
{`REACT_APP_CLOUDINARY_CLOUD_NAME=dxyz123abc
REACT_APP_CLOUDINARY_UPLOAD_PRESET=denmoda_uploads`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step5">
                    Step 5: Restart the App
                  </button>
                </h2>
                <div id="step5" className="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                  <div className="accordion-body">
                    <p>After updating .env, you MUST restart the development server:</p>
                    <ol>
                      <li>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> in the terminal to stop</li>
                      <li>Run <code>npm start</code> again</li>
                      <li>Refresh the browser</li>
                      <li>Click "Test Upload" above to verify</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudinarySetup;





