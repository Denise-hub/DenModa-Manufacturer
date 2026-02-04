import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      className={`back-to-top d-flex align-items-center justify-content-center ${isVisible ? 'active' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <i className="bi bi-arrow-up-short"></i>
    </button>
  );
};

export default BackToTop;





