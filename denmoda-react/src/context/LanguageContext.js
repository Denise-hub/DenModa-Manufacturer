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
      subtitle: 'Premium quality sandals made by skilled artisans using outsoles from discarded car tires to build a cleaner community',
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
        'Eco-friendly outsoles handcrafted from discarded car tires to clean our local environment',
        'Custom designs tailored to your unique style and preferences',
        'Supporting local waste clearance efforts and empowering communities through eco-craftsmanship'
      ],
      description: 'At DenModa, we believe that true craftsmanship tells a story of change. Every pair of sandals features a high-performance outsole crafted from recycled, discarded car tires, preventing waste from polluting our lands and creating a cleaner community. By merging tradition with eco-innovation, we create premium, comfortable, and sustainable footwear that leaves a green footprint.'
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
      subtitle: 'Sandales de qualité supérieure fabriquées par des artisans qualifiés en utilisant des semelles provenant de pneus de voiture abandonnés pour bâtir une communauté plus propre',
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
        'Semelles ultra-durables fabriquées à la main à partir de pneus de voiture abandonnés pour nettoyer notre environnement',
        'Designs personnalisés adaptés à votre style unique',
        'Soutenir l\'assainissement local des déchets et autonomiser les communautés grâce à l\'éco-artisanat'
      ],
      description: 'Chez DenModa, nous pensons que le véritable savoir-faire raconte une histoire de changement. Chaque paire de sandales est dotée d\'une semelle performante fabriquée à partir de pneus de voiture recyclés et abandonnés, évitant ainsi que les déchets ne polluent nos terres et favorisant une communauté plus propre. En fusionnant tradition et éco-innovation, nous créons des chaussures haut de gamme, confortables et durables.'
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


