import React, { useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
  const { about } = useData();
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  const content = {
    title: about?.title || t.about.title,
    subtitle: about?.subtitle || t.about.subtitle,
    description: about?.description || t.about.description,
    video: '/img/products/product-22.mov?v=20251206',
    features: about?.features?.length > 0 ? about.features : t.about.features
  };

  // Autoplay video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, []);

  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{content.title}</h2>
          <p>{content.subtitle}</p>
        </div>

        <div className="row content align-items-center">
          {/* Video Section */}
          <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right" data-aos-delay="100">
            <div 
              className="about-video-container"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(26, 43, 75, 0.12)',
                height: '420px'
              }}
            >
              <video
                ref={videoRef}
                src={content.video}
                loop
                muted
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
            <div 
              ref={contentRef}
              className="about-content-box"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 43, 75, 0.03) 0%, rgba(88, 238, 205, 0.05) 100%)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid rgba(88, 238, 205, 0.1)'
              }}
            >
              <h3 
                style={{ 
                  color: '#1a2b4b', 
                  fontSize: '1.2rem', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span 
                  style={{
                    width: '34px',
                    height: '34px',
                    background: 'linear-gradient(135deg, #58eecd 0%, #3c74db 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <i className="bi bi-stars" style={{ color: '#fff', fontSize: '16px' }}></i>
                </span>
                {t.about.whatMakesSpecial}
              </h3>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                {content.features.map((feature, index) => (
                  <li 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      marginBottom: '10px',
                      padding: '10px 12px',
                      background: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(26, 43, 75, 0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    className="feature-item-hover"
                  >
                    <span 
                      style={{
                        minWidth: '20px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #58eecd 0%, #3c74db 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    >
                      <i className="bi bi-check" style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}></i>
                    </span>
                    <span style={{ color: '#444', fontSize: '13px', lineHeight: '1.5' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <p style={{ 
                color: '#666', 
                lineHeight: '1.6', 
                fontSize: '13px',
                borderLeft: '3px solid #58eecd',
                paddingLeft: '12px',
                margin: 0,
                fontStyle: 'italic'
              }}>
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Styles */}
      <style>{`
        .feature-item-hover:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 20px rgba(26, 43, 75, 0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default About;
