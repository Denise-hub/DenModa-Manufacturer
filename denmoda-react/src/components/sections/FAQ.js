import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const FAQ = () => {
  const { faqs } = useData();
  const [openIndex, setOpenIndex] = useState(0);

  // Professional FAQs for DenModa
  const defaultFaqs = [
    {
      id: 'faq1',
      icon: 'bi-cart-check',
      question: 'How do I place an order?',
      answer: 'Ordering is simple! Browse our products, click the WhatsApp button on any item you like, and send us the pre-filled message. Our team will confirm availability, discuss sizing, and guide you through the payment process. You can also customize your order by sharing your specific requirements.'
    },
    {
      id: 'faq2',
      icon: 'bi-truck',
      question: 'How long does it take to receive my sandals?',
      answer: 'Each pair is handcrafted with care, so we allow up to 14 days for production and delivery. For standard designs, delivery is often faster. We\'ll keep you updated on your order status and provide tracking information once shipped.'
    },
    {
      id: 'faq3',
      icon: 'bi-geo-alt',
      question: 'Do you deliver nationwide?',
      answer: 'Yes! We deliver across the entire country. Simply provide your location during the order process, and we\'ll arrange delivery to your doorstep. Delivery fees vary based on your location and will be communicated before you confirm your order.'
    },
    {
      id: 'faq4',
      icon: 'bi-box-seam',
      question: 'What materials are used in DenModa sandals?',
      answer: 'We use premium, sustainable materials. Our women\'s sandals feature hand-woven yarn with intricate patterns, while men\'s sandals are crafted from quality leather. All our sandals have eco-friendly outsoles made from recycled tires, providing excellent durability and grip.'
    },
    {
      id: 'faq5',
      icon: 'bi-palette',
      question: 'Can I request a custom design?',
      answer: 'Absolutely! We love bringing unique visions to life. Share your design ideas, preferred colors, and any specific requirements via WhatsApp. Our artisans will work with you to create a one-of-a-kind pair that matches your style perfectly.'
    },
    {
      id: 'faq6',
      icon: 'bi-shield-check',
      question: 'What if my sandals don\'t fit or I\'m not satisfied?',
      answer: 'Your satisfaction is our priority. If you have any concerns about fit or quality, contact us immediately. We\'ll work with you to resolve any issues, whether that means adjustments, exchanges, or finding the perfect solution for your needs.'
    },
    {
      id: 'faq7',
      icon: 'bi-mortarboard',
      question: 'Do you offer training in sandal making?',
      answer: 'Yes! We run an artisan training program for aspiring craftspeople. Whether you want to learn a new skill or start your own business, our experienced artisans will teach you the art of handcrafted sandal making. Contact us for more details about enrollment.'
    }
  ];

  // Safely get faqs array
  const displayFaqs = (faqs && Array.isArray(faqs) && faqs.length > 0) ? faqs : defaultFaqs;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about DenModa products and services</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="faq-container">
              {displayFaqs.map((faq, index) => (
                <div 
                  key={faq.id || index}
                  className={`faq-item ${openIndex === index ? 'active' : ''}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openIndex === index}
                  >
                    <div className="faq-icon">
                      <i className={`bi ${faq.icon || 'bi-question-circle'}`}></i>
                    </div>
                    <span className="faq-number">0{index + 1}</span>
                    <h4>{faq.question}</h4>
                    <div className="faq-toggle-icon">
                      <i className={`bi ${openIndex === index ? 'bi-dash-lg' : 'bi-plus-lg'}`}></i>
                    </div>
                  </button>
                  
                  <div 
                    className="faq-answer"
                    style={{ 
                      maxHeight: openIndex === index ? '500px' : '0',
                      opacity: openIndex === index ? 1 : 0,
                      padding: openIndex === index ? '20px 25px 25px 85px' : '0 25px 0 85px'
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="faq-cta" data-aos="fade-up" data-aos-delay="300">
              <div className="cta-content">
                <i className="bi bi-chat-dots"></i>
                <div>
                  <h5>Still have questions?</h5>
                  <p>We're here to help. Reach out to us anytime!</p>
                </div>
              </div>
              <a href="#contact" className="btn btn-cta">
                Contact Us
                <i className="bi bi-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
