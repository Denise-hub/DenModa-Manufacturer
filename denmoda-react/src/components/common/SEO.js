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
  
  return (
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
  );
};

export default SEO;
