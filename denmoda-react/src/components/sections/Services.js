import React from 'react';
import { useData } from '../../context/DataContext';

const Services = () => {
  const { services } = useData();

  // Professional services for DenModa - Handcrafted Sandal Manufacturer (4 services, 2 per row)
  const defaultServices = [
    {
      id: 'srv1',
      icon: 'bi bi-truck',
      title: 'Nationwide Delivery',
      description: 'We bring DenModa right to your doorstep. Our reliable delivery service ensures your handcrafted sandals reach you safely and on time, anywhere in the country. Just tell us where, and we\'ll handle the rest.'
    },
    {
      id: 'srv2',
      icon: 'bi bi-palette',
      title: 'Custom Design Service',
      description: 'Have a unique vision? We bring it to life. Share your design ideas with our skilled artisans, and we\'ll craft bespoke sandals tailored to your exact preferences—style, color, size, and materials of your choice.'
    },
    {
      id: 'srv3',
      icon: 'bi bi-mortarboard',
      title: 'Artisan Training Program',
      description: 'Empowering the next generation of craftspeople. Our training program teaches the art of handcrafted sandal making, helping young entrepreneurs develop valuable skills and build their own sustainable businesses.'
    },
    {
      id: 'srv4',
      icon: 'bi bi-headset',
      title: 'Dedicated Customer Care',
      description: 'Your satisfaction is our priority. From sizing questions to after-sale support, our friendly team is always available via WhatsApp to assist you. We value your feedback and are committed to exceeding your expectations.'
    }
  ];

  // Safely get services array
  const displayServices = (services && Array.isArray(services) && services.length > 0) ? services : defaultServices;

  return (
    <section id="services" className="services">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>Experience the DenModa difference — where traditional craftsmanship meets exceptional customer care</p>
        </div>

        <div className="row gy-4">
          {displayServices.map((service, index) => (
            <div 
              key={service.id || index}
              className="col-lg-6 col-md-6 d-flex align-items-stretch"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="icon-box">
                <i className={service.icon}></i>
                <h4>
                  <span className="service-title">{service.title}</span>
                </h4>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
