import React, { useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';

const Hero = () => {
  const { heroSlides, siteSettings } = useData();
  const carouselRef = useRef(null);

  // Default slides matching original HTML
  const defaultSlides = [
    {
      id: 'h1',
      title: 'Welcome at',
      highlightText: 'DenModa',
      description: "Feel free to contact us and leave an order. We're here to satisfy your needs"
    },
    {
      id: 'h2',
      title: 'We offer quality and services',
      highlightText: '',
      description: 'Anywhere and anytime, we deliver your product ordered.'
    },
    {
      id: 'h3',
      title: 'Let us make you shine today',
      highlightText: '',
      description: 'Become stylish, comfortable and free to walk as far as you want with sandals, not heavy but of good quality.'
    }
  ];

  useEffect(() => {
    // Initialize Bootstrap Carousel
    if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: 5000,
        ride: 'carousel'
      });
    }
  }, []);

  // Use hero background from settings or default
  const heroBackground = siteSettings?.heroBackground || '/assets/hero-bg.jpg';
  
  // Safely get slides array
  const slides = (heroSlides && Array.isArray(heroSlides) && heroSlides.length > 0) ? heroSlides : defaultSlides;

  return (
    <section 
      id="hero" 
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        id="heroCarousel" 
        ref={carouselRef}
        className="container carousel carousel-fade" 
        data-bs-interval="5000" 
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div 
              key={slide.id || index} 
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <div className="carousel-container">
                <h2>
                  {slide.title} {slide.highlightText && <span>{slide.highlightText}</span>}
                </h2>
                <p>{slide.description}</p>
                <a 
                  href="#portfolio" 
                  className="btn-get-started"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector('#portfolio');
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  Explore Collection
                </a>
              </div>
            </div>
          ))}
        </div>

        <a 
          className="carousel-control-prev" 
          href="#heroCarousel" 
          role="button" 
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon bx bx-chevron-left" aria-hidden="true"></span>
        </a>

        <a 
          className="carousel-control-next" 
          href="#heroCarousel" 
          role="button" 
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon bx bx-chevron-right" aria-hidden="true"></span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
