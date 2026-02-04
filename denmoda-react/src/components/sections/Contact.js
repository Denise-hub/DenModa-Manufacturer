import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_tdwzv2j',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_6juvqcd',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'dYQW0Yb-PufAxNZAc'
};

const Contact = () => {
  const { contact } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  // Contact information (Email hidden from display but used for form submission)
  const defaultContact = {
    address: 'N28 Kyeshero Q, Goma, RDC',
    phone: '+254 798 257 117',
    whatsapp: '254798257117',
    email: 'denmaombi@gmail.com', // Hidden from display, used for form submission only
    socials: [
      { icon: 'bi-facebook', label: 'Facebook', url: 'https://web.facebook.com/profile.php?id=100078174605745', color: '#1877F2' },
      { icon: 'bi-instagram', label: 'Instagram', url: 'https://www.instagram.com/den_denmoda', color: '#E4405F' },
      { icon: 'bi-tiktok', label: 'TikTok', url: 'https://tiktok.com/@denmoda', color: '#000000' },
      { icon: 'bi-youtube', label: 'YouTube', url: 'https://www.youtube.com/channel/UCAfg9CgYWE5dCaay8GcGtsA/', color: '#FF0000' },
      { icon: 'bi-linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/denmoda/', color: '#0A66C2' }
    ]
  };

  const content = { ...defaultContact, ...contact };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', message: '' });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      setSending(false);
      return;
    }

    try {
      // Save message to Firestore
      await firestoreService.createMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        isRead: false
      });
      
      // Send automatic email reply to the user
      try {
        const emailResult = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: formData.name,
            to_email: formData.email,
            reply_to: formData.email,
            to_name: formData.name,
            message: formData.message,
            title: formData.subject || 'General Inquiry',
            subject: formData.subject || 'General Inquiry'
          },
          EMAILJS_CONFIG.publicKey
        );
        if (process.env.NODE_ENV === 'development') {
          console.log('Auto-reply email sent successfully:', emailResult);
        }
      } catch (emailError) {
        // Log error in development only
        if (process.env.NODE_ENV === 'development') {
          console.error('Error sending auto-reply email:', emailError);
          console.error('Email error details:', JSON.stringify(emailError, null, 2));
        }
        // Don't fail the whole submission if email fails
      }
      
      setStatus({ 
        type: 'success', 
        message: 'Thank you! Your message has been sent successfully. Check your email for a confirmation!' 
      });
      
      // Clear form after 5 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus({ type: '', message: '' });
      }, 5000);
      
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending message:', error);
      }
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppContact = () => {
    const welcomeMessage = encodeURIComponent("Hello DenModa! I'm interested in your products. Could you please tell me more?");
    
    // Extract phone number from whatsapp field (handles both URL and plain number formats)
    let phoneNumber = content.whatsapp;
    
    // If it's a URL, extract the phone number from it
    if (phoneNumber && phoneNumber.includes('phone=')) {
      const match = phoneNumber.match(/phone=(\d+)/);
      if (match) {
        phoneNumber = match[1];
      }
    }
    
    // Remove any non-digit characters except for leading +
    phoneNumber = phoneNumber.replace(/[^\d]/g, '');
    
    // Use the official WhatsApp API link with pre-filled welcome message
    window.open(`https://wa.me/${phoneNumber}?text=${welcomeMessage}`, '_blank');
  };

  return (
    <section id="contact" className="contact">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <p>Have a question or want to place an order? We'd love to hear from you!</p>
        </div>

        <div className="row align-items-stretch">
          {/* Contact Form */}
          <div className="col-lg-7 mb-4 mb-lg-0 d-flex" data-aos="fade-right" data-aos-delay="100">
            <div className="contact-form-card w-100 d-flex flex-column">
              <h4 className="form-title">
                <i className="bi bi-envelope-paper"></i>
                Send Us a Message
              </h4>
              
              <form onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Your Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Your Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-3 flex-grow-1 d-flex flex-column">
                  <label className="form-label">Message <span className="text-danger">*</span></label>
                  <textarea
                    name="message"
                    className="form-control flex-grow-1"
                    style={{ minHeight: '120px', resize: 'none' }}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {status.message && (
                  <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mb-3`}>
                    <i className={`bi ${status.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                    {status.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-submit mt-auto"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info - Email NOT displayed here */}
          <div className="col-lg-5 d-flex" data-aos="fade-left" data-aos-delay="200">
            <div className="contact-info-card w-100 d-flex flex-column">
              <h4 className="info-title">
                <i className="bi bi-info-circle"></i>
                Contact Information
              </h4>
              
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div className="info-content">
                  <h6>Our Location</h6>
                  <p>{content.address}</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-telephone"></i>
                </div>
                <div className="info-content">
                  <h6>Phone Number</h6>
                  <a href={`tel:+${content.whatsapp.replace(/[^\d]/g, '')}`}>{content.phone}</a>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="text-center mt-4 mb-4">
                <button 
                  className="btn btn-whatsapp"
                  onClick={handleWhatsAppContact}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Chat on WhatsApp
                </button>
              </div>

              {/* Social Links */}
              <div className="social-links mt-auto">
                <h6>Follow Us</h6>
                <div className="social-icons">
                  {content.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      title={social.label}
                      style={{ '--hover-color': social.color }}
                    >
                      <i className={`bi ${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
