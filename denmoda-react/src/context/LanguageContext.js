import React, { createContext, useContext, useState, useEffect } from 'react';

// Complete translations for the entire site
const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      products: 'Products',
      team: 'Team',
      contact: 'Contact',
      faq: 'FAQ',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      welcome: 'Welcome to',
      tagline: 'Handcrafted Sandals with Purpose',
      subtitle: 'Premium quality sandals made by skilled artisans using sustainable materials',
      cta: 'Shop Now',
      learnMore: 'Learn More'
    },
    // About Section
    about: {
      title: 'About DenModa',
      subtitle: 'Crafting Quality Handmade Sandals with Passion & Purpose',
      whatMakesSpecial: 'What makes DenModa special',
      features: [
        'Elegant hand-woven women\'s sandals crafted with intricate thread artistry',
        'Premium leather sandals for men, built for comfort and lasting durability',
        'Eco-friendly outsoles made from recycled tires for sustainability',
        'Custom designs tailored to your unique style and preferences',
        'Supporting local artisans and empowering communities through craftsmanship'
      ],
      description: 'At DenModa, we believe that true craftsmanship tells a story. Every stitch, every cut, and every detail is a testament to our dedication to quality and sustainability. We don\'t just make sandals—we create wearable art that combines comfort, durability, and timeless style.'
    },
    // Services Section
    services: {
      title: 'Our Services',
      subtitle: 'What We Offer'
    },
    // Products Section
    products: {
      title: 'Our Products',
      subtitle: 'Handcrafted sandals made with love and quality materials',
      all: 'All',
      men: 'Men',
      women: 'Women',
      new: 'New',
      showing: 'Showing',
      product: 'product',
      products: 'products',
      in: 'in',
      sizes: 'sizes',
      orderVia: 'Order via WhatsApp',
      description: 'Description',
      availableSizes: 'Available Sizes',
      contactNote: 'Contact us on WhatsApp to confirm size availability and place your order.'
    },
    // Team Section
    team: {
      title: 'Our Team',
      subtitle: 'Meet the talented people behind DenModa'
    },
    // Contact Section
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with us',
      location: 'Location',
      email: 'Email',
      phone: 'Phone',
      workingHours: 'Working Hours'
    },
    // FAQ Section
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions'
    },
    // Footer
    footer: {
      about: 'About DenModa',
      quickLinks: 'Quick Links',
      contact: 'Contact Us',
      rights: 'All Rights Reserved'
    },
    // Search
    search: {
      placeholder: 'Search products...',
      noResults: 'No products found',
      tip: 'Try searching for "leather" or "women"'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      backToWebsite: 'Back to Website'
    }
  },
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      about: 'À propos',
      services: 'Services',
      products: 'Produits',
      team: 'Équipe',
      contact: 'Contact',
      faq: 'FAQ',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      welcome: 'Bienvenue chez',
      tagline: 'Sandales Artisanales avec Passion',
      subtitle: 'Sandales de qualité supérieure fabriquées par des artisans qualifiés',
      cta: 'Acheter',
      learnMore: 'En Savoir Plus'
    },
    // About Section
    about: {
      title: 'À Propos de DenModa',
      subtitle: 'Créer des Sandales Artisanales de Qualité avec Passion',
      whatMakesSpecial: 'Ce qui rend DenModa spécial',
      features: [
        'Élégantes sandales tissées à la main pour femmes avec un art du fil complexe',
        'Sandales en cuir premium pour hommes, conçues pour le confort et la durabilité',
        'Semelles écologiques fabriquées à partir de pneus recyclés',
        'Designs personnalisés adaptés à votre style unique',
        'Soutenir les artisans locaux et autonomiser les communautés'
      ],
      description: 'Chez DenModa, nous croyons que le vrai savoir-faire raconte une histoire. Chaque point, chaque coupe et chaque détail témoigne de notre dévouement à la qualité et à la durabilité. Nous ne faisons pas que des sandales, nous créons de l\'art portable.'
    },
    // Services Section
    services: {
      title: 'Nos Services',
      subtitle: 'Ce Que Nous Offrons'
    },
    // Products Section
    products: {
      title: 'Nos Produits',
      subtitle: 'Sandales artisanales faites avec amour et matériaux de qualité',
      all: 'Tout',
      men: 'Hommes',
      women: 'Femmes',
      new: 'Nouveau',
      showing: 'Affichage',
      product: 'produit',
      products: 'produits',
      in: 'dans',
      sizes: 'tailles',
      orderVia: 'Commander via WhatsApp',
      description: 'Description',
      availableSizes: 'Tailles Disponibles',
      contactNote: 'Contactez-nous sur WhatsApp pour confirmer la disponibilité des tailles.'
    },
    // Team Section
    team: {
      title: 'Notre Équipe',
      subtitle: 'Rencontrez les talents derrière DenModa'
    },
    // Contact Section
    contact: {
      title: 'Contactez-Nous',
      subtitle: 'Entrez en contact avec nous',
      location: 'Adresse',
      email: 'Email',
      phone: 'Téléphone',
      workingHours: 'Heures d\'Ouverture'
    },
    // FAQ Section
    faq: {
      title: 'Questions Fréquentes',
      subtitle: 'Trouvez des réponses aux questions courantes'
    },
    // Footer
    footer: {
      about: 'À Propos de DenModa',
      quickLinks: 'Liens Rapides',
      contact: 'Contactez-Nous',
      rights: 'Tous Droits Réservés'
    },
    // Search
    search: {
      placeholder: 'Rechercher des produits...',
      noResults: 'Aucun produit trouvé',
      tip: 'Essayez "cuir" ou "femmes"'
    },
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      backToWebsite: 'Retour au Site'
    }
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('denmoda_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('denmoda_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = translations[language];

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isEnglish: language === 'en',
    isFrench: language === 'fr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;


