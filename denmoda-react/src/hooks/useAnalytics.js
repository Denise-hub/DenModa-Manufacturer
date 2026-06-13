import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as firestoreService from '../services/firestoreService';
import emailjs from '@emailjs/browser';

// Generate a unique visitor ID
const getVisitorId = () => {
  let visitorId = localStorage.getItem('denmoda_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('denmoda_visitor_id', visitorId);
  }
  return visitorId;
};

// Get device info
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let device = 'desktop';
  
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    device = /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
  }
  
  return {
    device,
    userAgent: userAgent.substring(0, 200),
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
};

// EmailJS Configuration for visitor notifications
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_tdwzv2j',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_6juvqcd',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'dYQW0Yb-PufAxNZAc'
};

// Admin email for notifications
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'denmoda.handmadeshoes@gmail.com';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = getVisitorId();
        const deviceInfo = getDeviceInfo();
        const referrer = document.referrer || 'direct';

        // Fetch approximate location from ipapi.co
        let locationStr = sessionStorage.getItem('denmoda_visitor_location');
        if (!locationStr) {
          try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
              const data = await res.json();
              locationStr = `${data.city || 'Unknown City'}, ${data.region || 'Unknown Region'}, ${data.country_name || 'Unknown Country'} (IP: ${data.ip || 'Unknown'})`;
            } else {
              locationStr = 'Location Access Failed';
            }
          } catch (err) {
            locationStr = 'Location Access Failed';
          }
          sessionStorage.setItem('denmoda_visitor_location', locationStr);
          sessionStorage.setItem('denmoda_visitor_device', deviceInfo.device);
        }
        
        // Track page view in Firestore
        await firestoreService.trackPageView({
          visitorId,
          page: location.pathname,
          referrer,
          location: locationStr,
          ...deviceInfo
        });

        // Send email notification only once per session (on first page load)
        // Make it non-blocking to avoid performance issues
        const hasNotified = sessionStorage.getItem('denmoda_visitor_notified');
        if (!hasNotified && location.pathname === '/') {
          sessionStorage.setItem('denmoda_visitor_notified', 'true');
          
          // Send email asynchronously without blocking
          emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
              from_name: 'DenModa Website',
              to_email: ADMIN_EMAIL,
              to_name: 'DenModa Admin',
              reply_to: ADMIN_EMAIL,
              subject: 'New Visitor on DenModa Website',
              message: `A new visitor has arrived on your DenModa website!\n\nVisitor ID: ${visitorId}\nDevice: ${deviceInfo.device}\nApproximate Location: ${locationStr}\nPage: ${window.location.href}\nReferrer: ${referrer}\nTime: ${new Date().toLocaleString()}`,
              title: 'New Visitor Notification'
            },
            EMAILJS_CONFIG.publicKey
          ).then(() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Visitor notification email sent');
            }
          }).catch((emailError) => {
            // Log error in development, silently fail in production
            if (process.env.NODE_ENV === 'development') {
              console.error('Error sending visitor notification email:', emailError);
            }
          });
        }
      } catch (error) {
        // Log tracking errors in development only
        if (process.env.NODE_ENV === 'development') {
          console.error('Analytics tracking error:', error);
        }
      }
    };

    trackVisit();
  }, [location.pathname]);
};

export default useAnalytics;


