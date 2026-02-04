import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = 'DenModa™ | Official Site - Premium Handcrafted Sandals & Footwear', 
  description = 'DenModa™ Official Website - The original premium handcrafted sandals brand. Eco-friendly, sustainable footwear made with recycled tire soles and quality leather. Authentic African craftsmanship from Goma, DRC. Custom designs available. Shop DenModa today!',
  keywords = 'DenModa, DenModa official, DenModa sandals, DenModa footwear, DenModa Africa, DenModa Goma, handmade sandals, handcrafted shoes, leather sandals, eco-friendly footwear, sustainable fashion, custom sandals, men sandals, women sandals, African fashion, Goma, DRC, Kenya, DenModa shop, buy DenModa',
  image = 'https://denmoda.web.app/assets/denmoda.png'
}) => {
  const location = useLocation();
  const canonicalUrl = `https://denmoda.web.app${location.pathname}`;
  
  // Structured Data (JSON-LD) for better SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DenModa",
    "alternateName": "DenModa™",
    "url": "https://denmoda.web.app",
    "logo": "https://denmoda.web.app/assets/denmoda.png",
    "description": "Premium handcrafted sandals and footwear made with recycled tire soles and quality leather. Authentic African craftsmanship from Goma, DRC.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "N28 Kyeshero Q",
      "addressLocality": "Goma",
      "addressRegion": "North Kivu",
      "addressCountry": "CD"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-798-257-117",
      "contactType": "Customer Service",
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "French", "Swahili"]
    },
    "sameAs": [
      "https://web.facebook.com/profile.php?id=100078174605745",
      "https://www.instagram.com/den_denmoda",
      "https://tiktok.com/@denmoda",
      "https://www.youtube.com/channel/UCAfg9CgYWE5dCaay8GcGtsA",
      "https://www.linkedin.com/company/denmoda"
    ],
    "foundingLocation": {
      "@type": "Place",
      "name": "Goma, Democratic Republic of the Congo"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DenModa Official Website",
    "url": "https://denmoda.web.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://denmoda.web.app/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* Canonical URL - Critical for SEO to prevent duplicate content */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="DenModa™ Official" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Prevent indexing of old GitHub Pages site */}
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </Helmet>
      
      {/* Structured Data (JSON-LD) for Search Engines */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </>
  );
};

export default SEO;
