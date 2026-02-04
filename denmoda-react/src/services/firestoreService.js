// Firestore Service - Controller Layer
// ====================================
// This file handles all database operations (CRUD)

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection names
export const COLLECTIONS = {
  HERO: 'hero',
  ICON_BOXES: 'iconBoxes',
  ABOUT: 'about',
  SERVICES: 'services',
  PRODUCTS: 'products',
  PRICING: 'pricing',
  TEAM: 'team',
  CONTACT: 'contact',
  FAQ: 'faq',
  SITE_SETTINGS: 'siteSettings',
  MESSAGES: 'messages',
  ORDERS: 'orders'
};

// ==================
// Generic CRUD Operations
// ==================

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @param {string} orderField - Field to order by (optional)
 * @returns {Promise<Array>} - Array of documents
 */
export const getAll = async (collectionName, orderField = 'order') => {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy(orderField, 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    // Fallback: get without ordering if index doesn't exist
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackError) {
      console.error(`Fallback error for ${collectionName}:`, fallbackError);
      return [];
    }
  }
};

/**
 * Get active documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} - Array of active documents
 */
export const getActive = async (collectionName) => {
  try {
    const q = query(
      collection(db, collectionName),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting active ${collectionName}:`, error);
    // Fallback without index
    return getAll(collectionName);
  }
};

/**
 * Get a single document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>} - Document data or null
 */
export const getById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error getting ${collectionName}/${docId}:`, error);
    return null;
  }
};

/**
 * Create a new document
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Document data
 * @returns {Promise<string>} - New document ID
 */
export const create = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create or update a document with a specific ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Document data
 */
export const createOrUpdate = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error(`Error creating/updating ${collectionName}/${docId}:`, error);
    throw error;
  }
};

/**
 * Update an existing document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Data to update
 */
export const update = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating ${collectionName}/${docId}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 */
export const remove = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// ==================
// Specific Collection Operations
// ==================

// Hero Slides
export const getHeroSlides = () => getActive(COLLECTIONS.HERO);
export const createHeroSlide = (data) => create(COLLECTIONS.HERO, data);
export const updateHeroSlide = (id, data) => update(COLLECTIONS.HERO, id, data);
export const deleteHeroSlide = (id) => remove(COLLECTIONS.HERO, id);

// Icon Boxes
export const getIconBoxes = () => getActive(COLLECTIONS.ICON_BOXES);
export const createIconBox = (data) => create(COLLECTIONS.ICON_BOXES, data);
export const updateIconBox = (id, data) => update(COLLECTIONS.ICON_BOXES, id, data);
export const deleteIconBox = (id) => remove(COLLECTIONS.ICON_BOXES, id);

// About
export const getAbout = () => getById(COLLECTIONS.ABOUT, 'main');
export const updateAbout = (data) => createOrUpdate(COLLECTIONS.ABOUT, 'main', data);

// Services
export const getServices = () => getActive(COLLECTIONS.SERVICES);
export const createService = (data) => create(COLLECTIONS.SERVICES, data);
export const updateService = (id, data) => update(COLLECTIONS.SERVICES, id, data);
export const deleteService = (id) => remove(COLLECTIONS.SERVICES, id);

// Products
export const getProducts = () => getAll(COLLECTIONS.PRODUCTS, 'order');
export const getActiveProducts = () => getActive(COLLECTIONS.PRODUCTS);
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('category', '==', category),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};
export const createProduct = (data) => create(COLLECTIONS.PRODUCTS, data);
export const updateProduct = (id, data) => update(COLLECTIONS.PRODUCTS, id, data);
export const deleteProduct = (id) => remove(COLLECTIONS.PRODUCTS, id);

// Pricing
export const getPricing = () => getActive(COLLECTIONS.PRICING);
export const createPricing = (data) => create(COLLECTIONS.PRICING, data);
export const updatePricing = (id, data) => update(COLLECTIONS.PRICING, id, data);
export const deletePricing = (id) => remove(COLLECTIONS.PRICING, id);

// Team
export const getTeam = () => getActive(COLLECTIONS.TEAM);
export const createTeamMember = (data) => create(COLLECTIONS.TEAM, data);
export const updateTeamMember = (id, data) => update(COLLECTIONS.TEAM, id, data);
export const deleteTeamMember = (id) => remove(COLLECTIONS.TEAM, id);

// Contact
export const getContact = () => getById(COLLECTIONS.CONTACT, 'main');
export const updateContact = (data) => createOrUpdate(COLLECTIONS.CONTACT, 'main', data);

// FAQ
export const getFAQ = () => getActive(COLLECTIONS.FAQ);
export const createFAQ = (data) => create(COLLECTIONS.FAQ, data);
export const updateFAQ = (id, data) => update(COLLECTIONS.FAQ, id, data);
export const deleteFAQ = (id) => remove(COLLECTIONS.FAQ, id);

// Site Settings
export const getSiteSettings = () => getById(COLLECTIONS.SITE_SETTINGS, 'main');
export const updateSiteSettings = (data) => createOrUpdate(COLLECTIONS.SITE_SETTINGS, 'main', data);

// Messages (Contact Form Submissions)
export const getMessages = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    // Fallback without ordering
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.MESSAGES));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackError) {
      console.error('Fallback error for messages:', fallbackError);
      return [];
    }
  }
};
export const createMessage = (data) => create(COLLECTIONS.MESSAGES, data);
export const updateMessage = (id, data) => update(COLLECTIONS.MESSAGES, id, data);
export const deleteMessage = (id) => remove(COLLECTIONS.MESSAGES, id);

// Orders (WhatsApp Order Tracking)
export const getOrders = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting orders:', error);
    // Fallback without ordering
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackError) {
      console.error('Fallback error for orders:', fallbackError);
      return [];
    }
  }
};
export const createOrder = (data) => create(COLLECTIONS.ORDERS, data);
export const updateOrder = (id, data) => update(COLLECTIONS.ORDERS, id, data);
export const deleteOrder = (id) => remove(COLLECTIONS.ORDERS, id);

// Analytics - Track page views and visitor data
export const trackPageView = async (pageData) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      ...pageData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const getAnalytics = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const snapshot = await getDocs(collection(db, 'analytics'));
    const allData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filter by date
    return allData.filter(item => {
      if (!item.timestamp) return false;
      const itemDate = item.timestamp.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
      return itemDate >= startDate;
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    return [];
  }
};

export const getTodayVisits = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const snapshot = await getDocs(collection(db, 'analytics'));
    const allData = snapshot.docs.map(doc => doc.data());
    
    return allData.filter(item => {
      if (!item.timestamp) return false;
      const itemDate = item.timestamp.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
      return itemDate >= today;
    }).length;
  } catch (error) {
    console.error('Error getting today visits:', error);
    return 0;
  }
};

// ==================
// Seed Database with Default Data
// ==================

export const seedDatabase = async (defaultData) => {
  const {
    heroSlides,
    iconBoxes,
    services,
    pricing,
    faqs,
    about,
    contact,
    team,
    products
  } = defaultData;

  try {
    // Seed Hero Slides
    if (heroSlides) {
      for (const slide of heroSlides) {
        await createOrUpdate(COLLECTIONS.HERO, slide.id, slide);
      }
    }

    // Seed Icon Boxes
    if (iconBoxes) {
      for (const box of iconBoxes) {
        await createOrUpdate(COLLECTIONS.ICON_BOXES, box.id, box);
      }
    }

    // Seed Services
    if (services) {
      for (const service of services) {
        await createOrUpdate(COLLECTIONS.SERVICES, service.id, service);
      }
    }

    // Seed Pricing
    if (pricing) {
      for (const price of pricing) {
        await createOrUpdate(COLLECTIONS.PRICING, price.id, price);
      }
    }

    // Seed FAQs
    if (faqs) {
      for (const faq of faqs) {
        await createOrUpdate(COLLECTIONS.FAQ, faq.id, faq);
      }
    }

    // Seed About
    if (about) {
      await updateAbout(about);
    }

    // Seed Contact
    if (contact) {
      await updateContact(contact);
    }

    // Seed Team
    if (team) {
      for (const member of team) {
        await createOrUpdate(COLLECTIONS.TEAM, member.id, member);
      }
    }

    // Seed Products
    if (products) {
      for (const product of products) {
        await createOrUpdate(COLLECTIONS.PRODUCTS, product.id, product);
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};




