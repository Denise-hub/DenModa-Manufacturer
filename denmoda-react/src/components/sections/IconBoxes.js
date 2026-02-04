import React from 'react';
import { useData } from '../../context/DataContext';

const IconBoxes = () => {
  const { iconBoxes } = useData();

  // Professional feature highlights for DenModa
  const defaultBoxes = [
    {
      id: 'ib1',
      icon: 'bi bi-hand-index-thumb',
      title: 'Handcrafted Excellence',
      description: "Every pair is meticulously crafted by skilled artisans using traditional techniques passed down through generations."
    },
    {
      id: 'ib2',
      icon: 'bi bi-shield-check',
      title: 'Quality Guaranteed',
      description: 'Premium materials meet expert craftsmanship. Our durable tire-sole technology ensures sandals that last for years.'
    },
    {
      id: 'ib3',
      icon: 'bi bi-lightning-charge',
      title: 'Fast & Reliable',
      description: 'Order today, wear soon. Our efficient 14-day production and nationwide delivery gets your sandals to you on time.'
    },
    {
      id: 'ib4',
      icon: 'bi bi-heart',
      title: '100% Satisfaction',
      description: "Your happiness is our success. We're committed to exceeding expectations with every pair we create."
    }
  ];

  // Safely get iconBoxes array
  const boxes = (iconBoxes && Array.isArray(iconBoxes) && iconBoxes.length > 0) ? iconBoxes : defaultBoxes;

  return (
    <section id="icon-boxes" className="icon-boxes">
      <div className="container">
        <div className="row">
          {boxes.map((box, index) => (
            <div 
              key={box.id || index}
              className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="icon-box">
                <div className="icon">
                  <i className={box.icon}></i>
                </div>
                <h4 className="title">
                  <span>{box.title}</span>
                </h4>
                <p className="description">{box.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IconBoxes;
