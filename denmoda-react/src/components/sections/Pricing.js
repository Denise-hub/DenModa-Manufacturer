import React from 'react';
import { useData } from '../../context/DataContext';

const Pricing = () => {
  const { pricing } = useData();

  // Default pricing matching original HTML exactly
  const defaultPricing = [
    {
      id: 'price1',
      title: 'Man',
      price: 15,
      currency: '$',
      period: 'Shoe',
      featured: true,
      advanced: false,
      items: ['Sewn-in sandal', 'Leather sandal', 'Others']
    },
    {
      id: 'price2',
      title: 'Woman',
      price: 10,
      currency: '$',
      period: 'Shoe',
      featured: false,
      advanced: false,
      items: ['Sewn-in sandal', 'Leather sandal', 'Others']
    },
    {
      id: 'price3',
      title: 'Child',
      price: 8,
      currency: '$',
      period: 'Shoe',
      featured: false,
      advanced: true,
      advancedLabel: 'Others',
      items: ['Sewn-in sandal', 'Leather sandal', 'Others']
    }
  ];

  // Safely get pricing array
  const displayPricing = (pricing && Array.isArray(pricing) && pricing.length > 0) ? pricing : defaultPricing;

  return (
    <section id="pricing" className="pricing">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Price</h2>
          <p>Here are our ranked prices</p>
        </div>

        <div className="row">
          {displayPricing.map((plan, index) => (
            <div 
              key={plan.id || index}
              className={`col-lg-4 col-md-6 ${index === 0 ? 'mt-4 mt-md-0' : 'mt-4 mt-lg-0'}`}
              data-aos="fade-up"
              data-aos-delay={(index + 2) * 100}
            >
              <div className={`box ${plan.featured ? 'featured' : ''}`}>
                {plan.advanced && (
                  <span className="advanced">{plan.advancedLabel || 'Others'}</span>
                )}
                <h3>{plan.title}</h3>
                <h4>
                  <sup>{plan.currency || '$'}</sup>
                  {plan.price}
                  <span> / {plan.period || 'Shoe'}</span>
                </h4>
                <ul>
                  {(plan.items || ['Sewn-in sandal', 'Leather sandal', 'Others']).map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
