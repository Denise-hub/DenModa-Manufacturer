import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackToTop from './components/common/BackToTop';

// Pages
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import SEO from './components/common/SEO';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useData } from './context/DataContext';
import { useAnalytics } from './hooks/useAnalytics';

// Default SEO values for optimal Google ranking
const DEFAULT_SEO = {
  title: 'DenModa™ | Official Site - Premium Handcrafted Sandals & Footwear',
  description: 'DenModa™ Official Website - The original premium handcrafted sandals brand. Eco-friendly, sustainable footwear made with recycled tire soles and quality leather. Authentic African craftsmanship from Goma, DRC. Custom designs available. Shop DenModa today!',
  keywords: 'DenModa, DenModa official, DenModa sandals, DenModa footwear, DenModa Africa, DenModa Goma, handmade sandals, handcrafted shoes, leather sandals, eco-friendly footwear, sustainable fashion, custom sandals, men sandals, women sandals, African fashion, Goma, DRC, Kenya, DenModa shop, buy DenModa'
};

function App() {
  const { loading, siteSettings } = useData();
  
  // Track page views for analytics
  useAnalytics();

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Use SEO-optimized defaults - ignore any old seoTitle from database
  const seoTitle = DEFAULT_SEO.title;
  const seoDescription = siteSettings?.seoDescription || DEFAULT_SEO.description;
  const seoKeywords = siteSettings?.seoKeywords || DEFAULT_SEO.keywords;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
              <Footer />
              <BackToTop />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

