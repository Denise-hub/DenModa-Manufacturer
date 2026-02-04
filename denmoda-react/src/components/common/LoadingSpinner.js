import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  // Brand colors from DenModa logo
  const brandColors = {
    navy: '#1a2b4b',
    teal: '#58eecd',
    blue: '#3c74db'
  };

  if (fullScreen) {
    return (
      <div 
        className="loading-screen d-flex justify-content-center align-items-center" 
        style={{ 
          minHeight: '100vh',
          backgroundColor: brandColors.navy,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative elements */}
        <div 
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: brandColors.teal,
            opacity: 0.05,
            filter: 'blur(60px)'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: brandColors.blue,
            opacity: 0.05,
            filter: 'blur(50px)'
          }}
        />
        
        {/* Main loading content */}
        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <img 
            src="/assets/denmoda.png" 
            alt="DenModa" 
            style={{ 
              width: '120px', 
              marginBottom: '30px',
              animation: 'pulse 2s ease-in-out infinite'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          
          {/* Three animated dots */}
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.7;
              transform: scale(0.95);
            }
          }
          
          .loading-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
          }
          
          .loading-dots .dot {
            width: 12px;
            height: 12px;
            background-color: ${brandColors.teal};
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite both;
          }
          
          .loading-dots .dot:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .loading-dots .dot:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          .loading-dots .dot:nth-child(3) {
            animation-delay: 0s;
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0.6);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // Non-fullscreen spinner (for sections) - also uses dots
  return (
    <div 
      className="d-flex justify-content-center align-items-center p-5"
      style={{ minHeight: '200px' }}
    >
      <div className="text-center">
        {/* Logo for section loading */}
        <img 
          src="/assets/denmoda.png" 
          alt="DenModa" 
          style={{ 
            width: '80px', 
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        
        {/* Three animated dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            backgroundColor: brandColors.teal,
            borderRadius: '50%',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: '-0.32s'
          }}></span>
          <span style={{
            width: '10px',
            height: '10px',
            backgroundColor: brandColors.teal,
            borderRadius: '50%',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: '-0.16s'
          }}></span>
          <span style={{
            width: '10px',
            height: '10px',
            backgroundColor: brandColors.teal,
            borderRadius: '50%',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: '0s'
          }}></span>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.95); }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingSpinner;
