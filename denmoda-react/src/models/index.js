// Data Models for Firestore Collections
// =====================================
// This file defines the data structures and default values for all collections

/**
 * Hero Slide Model
 * Used in the hero carousel section
 */
export const HeroSlideModel = {
  id: '',
  title: '',
  highlightText: '', // Text wrapped in <span> for highlighting
  description: '',
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * Icon Box Model
 * Small feature boxes below hero
 */
export const IconBoxModel = {
  id: '',
  icon: '', // Bootstrap icon class (e.g., 'bi-bag-dash')
  title: '',
  description: '',
  link: '',
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * About Section Model
 * Company information section
 */
export const AboutModel = {
  id: 'main',
  title: '',
  subtitle: '',
  description: '',
  image: '',
  imagePublicId: '',
  features: [], // Array of strings
  createdAt: null,
  updatedAt: null
};

/**
 * Service Model
 * Services offered by the company
 */
export const ServiceModel = {
  id: '',
  icon: '', // Bootstrap icon class
  title: '',
  description: '',
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * Product Model
 * Products in the portfolio section
 */
export const ProductModel = {
  id: '',
  title: '',
  category: '', // 'man', 'woman', 'new'
  image: '',
  imagePublicId: '',
  description: '',
  price: 0,
  sizes: [], // Array of available sizes
  orderLink: '', // WhatsApp link
  isNew: false,
  isFeatured: false,
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * Pricing Model
 * Pricing cards
 */
export const PricingModel = {
  id: '',
  category: '', // 'man', 'woman', 'child'
  price: 0,
  currency: '$',
  unit: 'Shoe',
  features: [], // Array of strings
  isFeatured: false,
  badge: '', // Optional badge text like "Others"
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * Team Member Model
 */
export const TeamMemberModel = {
  id: '',
  name: '',
  role: '',
  description: '',
  image: '',
  imagePublicId: '',
  socialLinks: {
    whatsapp: '',
    facebook: '',
    linkedin: '',
    instagram: ''
  },
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * Contact Info Model
 */
export const ContactModel = {
  id: 'main',
  address: '',
  email: '',
  phone: '',
  whatsapp: '',
  facebook: '',
  youtube: '',
  linkedin: '',
  instagram: '',
  createdAt: null,
  updatedAt: null
};

/**
 * FAQ Model
 */
export const FAQModel = {
  id: '',
  question: '',
  answer: '',
  order: 0,
  isActive: true,
  createdAt: null,
  updatedAt: null
};

/**
 * Site Settings Model
 * Global site configuration
 */
export const SiteSettingsModel = {
  id: 'main',
  siteName: 'DenModa',
  tagline: 'Manufacturer',
  logo: '',
  logoPublicId: '',
  favicon: '',
  heroBackground: '',
  heroBackgroundPublicId: '',
  footerLogo: '',
  footerLogoPublicId: '',
  footerAbout: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  createdAt: null,
  updatedAt: null
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  { value: 'man', label: 'Men' },
  { value: 'woman', label: 'Women' },
  { value: 'new', label: 'New Arrival' }
];

// Default Hero Slides Data
export const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide1',
    title: 'Welcome at',
    highlightText: 'DenModa',
    description: "Feel free to contact us and leave an order. We're here to meet your needs",
    order: 1,
    isActive: true
  },
  {
    id: 'slide2',
    title: 'We offer quality and services',
    highlightText: '',
    description: 'Anywhere and anytime, we deliver your product.',
    order: 2,
    isActive: true
  },
  {
    id: 'slide3',
    title: 'Let us make you shine today',
    highlightText: '',
    description: 'Become stylish, comfortable and free to walk as far as you want with sandals, not heavy but of good quality.',
    order: 3,
    isActive: true
  }
];

// Default Icon Boxes Data
export const DEFAULT_ICON_BOXES = [
  {
    id: 'box1',
    icon: 'bi-bag-dash',
    title: 'Order',
    description: "Do you want to shine, to be elegant? Book your product, we'll make your dream come true.",
    order: 1
  },
  {
    id: 'box2',
    icon: 'bx bx-alarm',
    title: 'On time delivery',
    description: 'We care about respecting time. The given deadline is met.',
    order: 2
  },
  {
    id: 'box3',
    icon: 'bx bx-message',
    title: 'Comment',
    description: 'For any problem, send us a feedback message, you will get a reply from us as soon as possible.',
    order: 3
  },
  {
    id: 'box4',
    icon: 'bx bx-happy',
    title: 'Satisfaction',
    description: "We care about our customers' satisfaction. At DenModa, you're the king.",
    order: 4
  }
];

// Default Services Data
export const DEFAULT_SERVICES = [
  {
    id: 'service1',
    icon: 'bi-house',
    title: 'Home delivery',
    description: 'At DenModa, once you order a product it is delivered to you wherever you are',
    order: 1
  },
  {
    id: 'service2',
    icon: 'bi-book',
    title: 'Sandal Making Training',
    description: 'To help young people who are interested, we offer an arts training program',
    order: 2
  },
  {
    id: 'service3',
    icon: 'bi-brightness-high',
    title: 'Products feedback',
    description: 'We track our products, wherever you are, you can contact us if you have a question or comment',
    order: 3
  },
  {
    id: 'service4',
    icon: 'bi-clock',
    title: 'Timeliness',
    description: 'We give a lead time of 14 days after ordering; The product is delivered within the time frame. Place your order anytime, any day because we work 7 days a week and 24 hours a day',
    order: 4
  }
];

// Default Pricing Data
export const DEFAULT_PRICING = [
  {
    id: 'price1',
    category: 'Man',
    price: 15,
    currency: '$',
    unit: 'Shoe',
    features: ['Sewn-in sandal', 'Leather sandal', 'Others'],
    isFeatured: true,
    order: 1
  },
  {
    id: 'price2',
    category: 'Woman',
    price: 10,
    currency: '$',
    unit: 'Shoe',
    features: ['Sewn-in sandal', 'Leather sandal', 'Others'],
    isFeatured: false,
    order: 2
  },
  {
    id: 'price3',
    category: 'Child',
    price: 8,
    currency: '$',
    unit: 'Shoe',
    features: ['Sewn-in sandal', 'Leather sandal', 'Others'],
    isFeatured: false,
    badge: 'Others',
    order: 3
  }
];

// Default FAQ Data
export const DEFAULT_FAQS = [
  {
    id: 'faq1',
    question: 'How to order?',
    answer: 'By clicking on the order button and filling out the form.',
    order: 1
  },
  {
    id: 'faq2',
    question: 'How long does it take for a customer who has ordered to receive the product?',
    answer: 'We give a maximum of one week.',
    order: 2
  },
  {
    id: 'faq3',
    question: 'How do I get the product?',
    answer: 'We deliver the product at your convenience. You just need to let us know the time and where to reach you.',
    order: 3
  },
  {
    id: 'faq4',
    question: 'Which material is used?',
    answer: 'Some of our products are made from yarn, which means we sew them by hand and then attach the outsole that comes from the tire. And other products are made from leather and after putting on the outsole of the tires too.',
    order: 4
  },
  {
    id: 'faq5',
    question: 'Do you offer good product quality service?',
    answer: 'Yes, our products are made from tire outsole, which makes them durable and good quality.',
    order: 5
  }
];

