import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const welcomeMessage = encodeURIComponent("Hello DenModa! I'm interested in your products. Could you please tell me more?");
    window.open(`https://wa.me/254798257117?text=${welcomeMessage}`, '_blank');
  };

  const socialLinks = [
    { href: '#', icon: 'bx bxl-whatsapp', label: 'WhatsApp', onClick: handleWhatsAppClick },
    { href: 'https://web.facebook.com/profile.php?id=100078174605745', icon: 'bx bxl-facebook', label: 'Facebook' },
    { href: 'https://www.youtube.com/channel/UCAfg9CgYWE5dCaay8GcGtsA/', icon: 'bx bxl-youtube', label: 'YouTube' },
    { href: 'https://www.linkedin.com/company/denmoda/', icon: 'bx bxl-linkedin', label: 'LinkedIn' }
  ];

  const services = [
    'Home delivery service',
    'Sandal Making Training',
    'Product Management',
    'Product Feedback Service'
  ];

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">

          <div className="row">
            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Our Services</h4>
              <ul>
                {services.map((service, index) => (
                  <li key={index}>
                    <i className="bx bx-chevron-right"></i>
                    <a 
                      href="#services" 
                      onClick={(e) => scrollToSection(e, '#services')}
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-contact">
              <h4>Find Us</h4>
              <p>
                N28 Kyeshero Q <br />
                Goma, Bp 50, RDC <br /><br />
              </p>
            </div>

            <div className="col-lg-3 col-md-6 footer-info">
              <h3>About Denmoda</h3>
              <p>We are a local shoe manufacturing industry, we offer goods and services.</p>
              <div className="social-links mt-3">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className={link.label.toLowerCase()}
                    target={link.onClick ? undefined : "_blank"}
                    rel={link.onClick ? undefined : "noopener noreferrer"}
                    title={link.label}
                    onClick={link.onClick ? (e) => {
                      e.preventDefault();
                      link.onClick(e);
                    } : undefined}
                    style={{ cursor: link.onClick ? 'pointer' : 'default' }}
                  >
                    <i className={link.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="col-lg-3 col-md-6 footer-links d-flex align-items-start justify-content-center">
              <img 
                src="/assets/denmoda.png" 
                className="img-fluid" 
                alt="DenModa Logo"
                style={{ maxWidth: '150px', marginTop: '0' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="copyright">
          &copy; Copyright {currentYear} <strong><span>Denmoda</span></strong>. All Rights Reserved
        </div>
        <div className="credits">
          Designed by <span style={{ color: '#58eecd' }}>@DenDesign</span> | <Link to="/login" style={{ color: '#58eecd' }}>Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
