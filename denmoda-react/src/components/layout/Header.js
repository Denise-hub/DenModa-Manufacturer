import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// Mobile menu styles - inline to ensure they always apply
const mobileMenuStyles = `
  .mobile-nav-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(60, 116, 219, 0.65) !important;
    z-index: 9998 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .mobile-nav-menu {
    position: fixed !important;
    top: 70px !important;
    left: 15px !important;
    right: 15px !important;
    bottom: 15px !important;
    background: rgba(26, 43, 75, 0.95) !important;
    border-radius: 10px !important;
    padding: 15px 0 !important;
    overflow-y: auto !important;
    z-index: 9999 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    list-style: none !important;
    margin: 0 !important;
  }
  .mobile-nav-menu li {
    display: block !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .mobile-nav-menu li a {
    display: block !important;
    padding: 15px 25px !important;
    font-size: 16px !important;
    color: #ffffff !important;
    background: transparent !important;
    text-decoration: none !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .mobile-nav-menu li a:hover {
    color: #58eecd !important;
  }
  .mobile-nav-menu .mobile-menu-actions {
    display: flex !important;
    justify-content: center !important;
    gap: 20px !important;
    padding: 20px 0 !important;
    margin-top: 15px !important;
    border-top: 1px solid rgba(255,255,255,0.1) !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .mobile-nav-menu .mobile-icon-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    color: #58eecd !important;
    background: rgba(26, 43, 75, 0.8) !important;
    font-size: 22px !important;
    border: none !important;
    cursor: pointer !important;
  }
  .mobile-nav-menu .mobile-icon-btn:hover {
    background: rgba(88, 238, 205, 0.2) !important;
    color: #ffffff !important;
  }
  .mobile-nav-close {
    position: fixed !important;
    top: 20px !important;
    right: 25px !important;
    font-size: 32px !important;
    color: #58eecd !important;
    cursor: pointer !important;
    z-index: 10000 !important;
    background: transparent !important;
    border: none !important;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const { user } = useAuth();
  const { products } = useData();
  const { t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() && products) {
      const query = searchQuery.toLowerCase();
      const results = products.filter(product => 
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  const handleSearchResultClick = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileNavOpen(false);
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const getCategoryLabel = (category) => {
    if (category === 'man') return t.products.men;
    if (category === 'woman') return t.products.women;
    return t.products.new;
  };

  const navLinks = [
    { href: '#hero', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#portfolio', label: t.nav.products },
    { href: '#team', label: t.nav.team },
    { href: '#contact', label: t.nav.contact },
    { href: '#faq', label: t.nav.faq }
  ];

  return (
    <>
      {/* Inject mobile menu styles when menu is open */}
      {isMobileNavOpen && <style>{mobileMenuStyles}</style>}
      
      <header 
        id="header" 
        className={`fixed-top d-flex align-items-center m-2 ${isScrolled ? 'header-scrolled' : ''}`}
      >
        <div className="container d-flex align-items-center justify-content-between">
          <h1 className="logo">
            <img src="/assets/favicon.png" className="img-fluid" alt="DenModa Logo" />
            enModa
          </h1>

          <nav id="navbar" className="navbar">
            {/* Desktop Navigation */}
            <ul>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    className="nav-link scrollto"
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {user && (
                <li>
                  <Link to="/admin" className="nav-link">
                    <i className="bi bi-gear"></i> {t.nav.admin}
                  </Link>
                </li>
              )}
              <li className="header-actions">
                <div className="search-container" ref={searchRef}>
                  <button 
                    className="header-icon-btn search-icon"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    title="Search"
                  >
                    <i className="bi bi-search"></i>
                  </button>
                  
                  {isSearchOpen && (
                    <div className="search-dropdown">
                      <div className="search-input-wrapper">
                        <i className="bi bi-search search-input-icon"></i>
                        <input
                          type="text"
                          placeholder={t.search.placeholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          className="search-input"
                        />
                      </div>
                      
                      {searchResults.length > 0 && (
                        <div className="search-results">
                          {searchResults.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleSearchResultClick(product)}
                              className="search-result-item"
                            >
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="search-result-img"
                                onError={(e) => { e.target.src = '/assets/denmoda.png'; }}
                              />
                              <div>
                                <div className="search-result-title">{product.title}</div>
                                <div className="search-result-meta">
                                  ${product.price} • {getCategoryLabel(product.category)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {searchQuery && searchResults.length === 0 && (
                        <div className="search-no-results">
                          <i className="bi bi-search"></i>
                          {t.search.noResults}
                        </div>
                      )}
                      
                      {!searchQuery && (
                        <div className="search-tip">
                          <i className="bi bi-lightbulb"></i>
                          {t.search.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  className="header-icon-btn theme-icon"
                  onClick={toggleTheme}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
                </button>
              </li>
            </ul>
            
            {/* Mobile Nav Toggle Button */}
            <i 
              className={`bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'} mobile-nav-toggle`}
              onClick={toggleMobileNav}
              style={{ cursor: 'pointer' }}
            ></i>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation - Completely separate from main nav */}
      {isMobileNavOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={toggleMobileNav}></div>
          <button className="mobile-nav-close" onClick={toggleMobileNav}>
            <i className="bi bi-x"></i>
          </button>
          <ul className="mobile-nav-menu">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {user && (
              <li>
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <i className="bi bi-gear"></i> {t.nav.admin}
                </Link>
              </li>
            )}
            <li className="mobile-menu-actions">
              <button 
                className="mobile-icon-btn"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMobileNavOpen(false);
                }}
                title="Search"
              >
                <i className="bi bi-search"></i>
              </button>
              <button 
                className="mobile-icon-btn"
                onClick={toggleTheme}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default Header;
