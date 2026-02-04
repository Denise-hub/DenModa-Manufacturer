// Data Context
// =============
// Provides site data throughout the app

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as firestoreService from '../services/firestoreService';
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_ICON_BOXES,
  DEFAULT_SERVICES,
  DEFAULT_PRICING,
  DEFAULT_FAQS
} from '../models';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);
  const [iconBoxes, setIconBoxes] = useState(DEFAULT_ICON_BOXES);
  const [about, setAbout] = useState(null);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [products, setProducts] = useState([]);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [team, setTeam] = useState([]);
  const [contact, setContact] = useState(null);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [siteSettings, setSiteSettings] = useState(null);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        heroData,
        iconBoxesData,
        aboutData,
        servicesData,
        productsData,
        pricingData,
        teamData,
        contactData,
        faqsData,
        settingsData
      ] = await Promise.all([
        firestoreService.getHeroSlides(),
        firestoreService.getIconBoxes(),
        firestoreService.getAbout(),
        firestoreService.getServices(),
        firestoreService.getActiveProducts(),
        firestoreService.getPricing(),
        firestoreService.getTeam(),
        firestoreService.getContact(),
        firestoreService.getFAQ(),
        firestoreService.getSiteSettings()
      ]);

      // Use fetched data or defaults
      setHeroSlides(heroData.length > 0 ? heroData : DEFAULT_HERO_SLIDES);
      setIconBoxes(iconBoxesData.length > 0 ? iconBoxesData : DEFAULT_ICON_BOXES);
      setAbout(aboutData);
      setServices(servicesData.length > 0 ? servicesData : DEFAULT_SERVICES);
      setProducts(productsData);
      setPricing(pricingData.length > 0 ? pricingData : DEFAULT_PRICING);
      setTeam(teamData);
      setContact(contactData);
      setFaqs(faqsData.length > 0 ? faqsData : DEFAULT_FAQS);
      setSiteSettings(settingsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh functions for each collection
  const refreshHeroSlides = async () => {
    const data = await firestoreService.getHeroSlides();
    setHeroSlides(data.length > 0 ? data : DEFAULT_HERO_SLIDES);
  };

  const refreshIconBoxes = async () => {
    const data = await firestoreService.getIconBoxes();
    setIconBoxes(data.length > 0 ? data : DEFAULT_ICON_BOXES);
  };

  const refreshAbout = async () => {
    const data = await firestoreService.getAbout();
    setAbout(data);
  };

  const refreshServices = async () => {
    const data = await firestoreService.getServices();
    setServices(data.length > 0 ? data : DEFAULT_SERVICES);
  };

  const refreshProducts = async () => {
    const data = await firestoreService.getActiveProducts();
    setProducts(data);
  };

  // Get ALL products (including inactive) for admin panel
  const refreshAllProducts = async () => {
    const data = await firestoreService.getProducts();
    setProducts(data);
  };

  const refreshPricing = async () => {
    const data = await firestoreService.getPricing();
    setPricing(data.length > 0 ? data : DEFAULT_PRICING);
  };

  const refreshTeam = async () => {
    const data = await firestoreService.getTeam();
    setTeam(data);
  };

  const refreshContact = async () => {
    const data = await firestoreService.getContact();
    setContact(data);
  };

  const refreshFaqs = async () => {
    const data = await firestoreService.getFAQ();
    setFaqs(data.length > 0 ? data : DEFAULT_FAQS);
  };

  const refreshSiteSettings = async () => {
    const data = await firestoreService.getSiteSettings();
    setSiteSettings(data);
  };

  const value = {
    loading,
    error,
    heroSlides,
    iconBoxes,
    about,
    services,
    products,
    pricing,
    team,
    contact,
    faqs,
    siteSettings,
    refreshAllData: fetchAllData,
    refreshHeroSlides,
    refreshIconBoxes,
    refreshAbout,
    refreshServices,
    refreshProducts,
    refreshAllProducts,
    refreshPricing,
    refreshTeam,
    refreshContact,
    refreshFaqs,
    refreshSiteSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;




