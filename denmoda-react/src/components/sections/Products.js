import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import LoadingSpinner from '../common/LoadingSpinner';
import * as firestoreService from '../../services/firestoreService';
import emailjs from '@emailjs/browser';

// EmailJS Configuration for order notifications
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_tdwzv2j',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_6juvqcd',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'dYQW0Yb-PufAxNZAc'
};

// Admin email for notifications
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'denmoda.manufacturing@gmail.com';

// USD to KES exchange rate
const USD_TO_KES_RATE = 130;

// Default products (moved outside component to avoid re-creation)
const DEFAULT_PRODUCTS = [
    { 
      id: 'p1', 
      title: 'Classic Leather Sandal', 
      category: 'man', 
      image: '/img/products/product-29.JPG',
      description: 'Handcrafted men\'s leather sandal with durable tire outsole. Perfect for everyday wear.',
      sizes: ['40', '41', '42', '43', '44', '45'],
      price: 15
    },
    { 
      id: 'p2', 
      title: 'New Arrival - Premium', 
      category: 'new', 
      image: '/img/products/product-25.JPG',
      description: 'Our latest design featuring premium materials and modern styling.',
      sizes: ['38', '39', '40', '41', '42', '43', '44'],
      price: 18
    },
    { 
      id: 'p3', 
      title: 'Urban Style Sandal', 
      category: 'man', 
      image: '/img/products/product-28.JPG',
      description: 'Modern urban style sandal for men. Combines comfort with contemporary design.',
      sizes: ['40', '41', '42', '43', '44'],
      price: 15
    },
    { 
      id: 'p4', 
      title: 'Elegant Thread Sandal', 
      category: 'woman', 
      image: '/img/products/product-10.jpg',
      description: 'Hand-sewn women\'s sandal with intricate thread work. Elegant and comfortable.',
      sizes: ['36', '37', '38', '39', '40'],
      price: 10
    },
    { 
      id: 'p5', 
      title: 'New Design - Casual', 
      category: 'new', 
      image: '/img/products/product-9.jpeg',
      description: 'Fresh new design perfect for casual outings. Comfortable all-day wear.',
      sizes: ['38', '39', '40', '41', '42', '43'],
      price: 16
    },
    { 
      id: 'p6', 
      title: 'Executive Sandal', 
      category: 'man', 
      image: '/img/products/product-15.jpg',
      description: 'Professional-looking sandal for the modern man. Quality craftsmanship.',
      sizes: ['40', '41', '42', '43', '44', '45'],
      price: 15
    },
    { 
      id: 'p7', 
      title: 'Chic Women\'s Sandal', 
      category: 'woman', 
      image: '/img/products/product-21.JPG',
      description: 'Stylish and sophisticated sandal for women. Perfect for any occasion.',
      sizes: ['36', '37', '38', '39', '40'],
      price: 10
    },
    { 
      id: 'p8', 
      title: 'Bohemian Style', 
      category: 'woman', 
      image: '/img/products/product-31.jpg',
      description: 'Beautiful bohemian-inspired design. Handwoven with care and attention to detail.',
      sizes: ['36', '37', '38', '39', '40', '41'],
      price: 12
    },
    { 
      id: 'p9', 
      title: 'Latest Collection', 
      category: 'new', 
      image: '/img/products/product-12.jpg',
      description: 'From our newest collection. Innovative design meets traditional craftsmanship.',
      sizes: ['38', '39', '40', '41', '42', '43', '44'],
      price: 20
    },
    { 
      id: 'p10', 
      title: 'Classic Men\'s Brown', 
      category: 'man', 
      image: '/img/products/product-8.jpeg',
      description: 'Timeless brown leather sandal for men. Durable and stylish.',
      sizes: ['40', '41', '42', '43', '44'],
      price: 15
    },
    { 
      id: 'p11', 
      title: 'Women\'s Delicate Design', 
      category: 'woman', 
      image: '/img/products/product-11.jpg',
      description: 'Delicate and feminine sandal design. Lightweight and comfortable.',
      sizes: ['36', '37', '38', '39', '40'],
      price: 10
    },
    { 
      id: 'p12', 
      title: 'Premium New Style', 
      category: 'new', 
      image: '/img/products/product-14.jpg',
      description: 'Premium quality new arrival. Made with the finest materials.',
      sizes: ['38', '39', '40', '41', '42', '43'],
      price: 22
    }
];

const Products = () => {
  const { products, loading } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [orderFormData, setOrderFormData] = useState({
    customerName: '',
    customerPhone: '',
    selectedSize: ''
  });

  // Use Firebase products or defaults
  const displayProducts = useMemo(() => {
    return (products && products.length > 0) ? products : DEFAULT_PRODUCTS;
  }, [products]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (filter === 'all') {
      return displayProducts;
    }
    return displayProducts.filter(product => product.category === filter);
  }, [filter, displayProducts]);

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
  };

  const openProductDetails = (product) => {
    // Save current scroll position before opening modal
    setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
    setSelectedProduct(product);
    setShowModal(true);
    // Prevent background scrolling on mobile
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  };

  const closeOrderForm = useCallback(() => {
    setShowOrderForm(false);
    setOrderProduct(null);
    setOrderFormData({ customerName: '', customerPhone: '', selectedSize: '' });
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedProduct(null);
    // Re-enable scrolling
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    // Restore scroll position after a brief delay
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 10);
  }, [scrollPosition]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showOrderForm) {
          closeOrderForm();
        } else {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showOrderForm, closeOrderForm, closeModal]);

  const handleWhatsAppOrderClick = (product, event) => {
    if (event) event.preventDefault();
    setOrderProduct(product);
    setShowOrderForm(true);
    // Close product details modal if open
    if (showModal) {
      closeModal();
    }
  };

  const handleOrderFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderFormData.customerName || !orderFormData.customerPhone) {
      alert('Please fill in your name and phone number');
      return;
    }

    const product = orderProduct;
    const sizes = product.sizes?.join(', ') || 'Please inquire';
    const category = getCategoryLabel(product.category);
    const priceKES = (product.price * USD_TO_KES_RATE).toLocaleString();
    const selectedSize = orderFormData.selectedSize || 'Not specified';
    
    // Build WhatsApp message with order details
    // Product image URL is saved in order data for admin reference
    const message = encodeURIComponent(
      `Hello DenModa Team!\n\n` +
      `I would like to place an order for:\n\n` +
      `*Product:* ${product.title}\n` +
      `*Category:* ${category}\n` +
      `*Price:* $${product.price} (KES ${priceKES})\n` +
      `*Available Sizes:* ${sizes}\n` +
      `*My Preferred Size:* ${selectedSize}\n\n` +
      `*My Details:*\n` +
      `Name: ${orderFormData.customerName}\n` +
      `Phone: ${orderFormData.customerPhone}\n\n` +
      `Please confirm availability and let me know how to proceed with the order.\n\n` +
      `Thank you!`
    );
    
    const phoneNumber = '254798257117';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Save order to Firestore for tracking with customer info (non-blocking)
    (async () => {
      try {
      // Get full product image URL
      const productImageUrl = product.image?.startsWith('http') 
        ? product.image 
        : `${window.location.origin}${product.image}`;
      
      const orderData = {
        productId: product.id,
        productTitle: product.title,
        productImage: productImageUrl, // Full URL for admin reference
        productPrice: product.price,
        priceKES: priceKES,
        productCategory: category,
        availableSizes: sizes,
        customerName: orderFormData.customerName,
        customerPhone: orderFormData.customerPhone,
        selectedSize: selectedSize,
        status: 'pending',
        source: 'website'
      };
        const orderId = await firestoreService.createOrder(orderData);
        
        // Send email notification to admin about new order (async, don't wait)
        emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: 'DenModa Website',
            to_email: ADMIN_EMAIL,
            to_name: 'DenModa Admin',
            reply_to: ADMIN_EMAIL,
            subject: `New Order Received - ${orderFormData.customerName}`,
            message: `A new order has been received on your DenModa website!\n\n` +
              `━━━━━━━━━━━━━━━━━━━━━\n` +
              `ORDER DETAILS\n` +
              `━━━━━━━━━━━━━━━━━━━━━\n\n` +
              `Customer Name: ${orderFormData.customerName}\n` +
              `Phone: ${orderFormData.customerPhone}\n` +
              `Product: ${product.title}\n` +
              `Price: $${product.price} (KES ${priceKES})\n` +
              `Size: ${selectedSize}\n` +
              `Category: ${category}\n` +
              `Status: Pending\n\n` +
              `Please check your admin panel to confirm and process this order.\n\n` +
              `Order ID: ${orderId || 'N/A'}\n` +
              `Time: ${new Date().toLocaleString()}`,
            title: `New Order - ${product.title}`
          },
          EMAILJS_CONFIG.publicKey
        ).catch((emailError) => {
          // Log error in development only
          if (process.env.NODE_ENV === 'development') {
            console.error('Error sending order notification email:', emailError);
          }
        });
        
      } catch (error) {
        // Log error in development only
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving order:', error);
        }
      }
    })();
    
    // Reset form immediately
    setOrderFormData({ customerName: '', customerPhone: '', selectedSize: '' });
    setShowOrderForm(false);
    setOrderProduct(null);
    
    // Open WhatsApp immediately - this is the primary action
    // Order saving happens in background
    window.open(whatsappUrl, '_blank');
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'man': 'Men',
      'woman': 'Women',
      'new': 'New Arrival'
    };
    return labels[category] || category;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section id="portfolio" className="products-section">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Our Products</h2>
          <p>Handcrafted sandals made with love and quality materials</p>
        </div>

        {/* Filter Buttons */}
        <div className="products-filter">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            <i className="bi bi-grid-3x3-gap"></i>
            <span>All</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'man' ? 'active' : ''}`}
            onClick={() => handleFilterClick('man')}
          >
            <i className="bi bi-person"></i>
            <span>Men</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'woman' ? 'active' : ''}`}
            onClick={() => handleFilterClick('woman')}
          >
            <i className="bi bi-person-hearts"></i>
            <span>Women</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => handleFilterClick('new')}
          >
            <i className="bi bi-stars"></i>
            <span>New</span>
          </button>
        </div>

        {/* Products Count */}
        <div className="products-count">
          Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          {filter !== 'all' && <span> in <strong>{getCategoryLabel(filter)}</strong></span>}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card" data-aos="fade-up">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = '/assets/denmoda.png';
                    }}
                  />
                  <div className="product-category">
                    {getCategoryLabel(product.category)}
                  </div>
                  <div className="product-overlay">
                    <button 
                      className="product-action-btn info-btn"
                      onClick={() => openProductDetails(product)}
                      title="View Details"
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                    <button 
                      className="product-action-btn order-btn"
                      onClick={(e) => handleWhatsAppOrderClick(product, e)}
                      title="Order via WhatsApp"
                    >
                      <i className="bi bi-whatsapp"></i>
                    </button>
                  </div>
                </div>
                <div className="product-details">
                  <h4 className="product-title">{product.title}</h4>
                  <div className="product-meta">
                    <span className="product-price">
                      ${product.price} <span className="price-kes">/ KES {(product.price * USD_TO_KES_RATE).toLocaleString()}</span>
                    </span>
                    {product.sizes && (
                      <span className="product-sizes">
                        <i className="bi bi-rulers"></i> {product.sizes.length} sizes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <i className="bi bi-inbox"></i>
              <p>No products found in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title}
                  onError={(e) => {
                    e.target.src = '/assets/denmoda.png';
                  }}
                />
              </div>
              
              <div className="modal-details">
                <span className="modal-category">{getCategoryLabel(selectedProduct.category)}</span>
                <h3 className="modal-title">{selectedProduct.title}</h3>
                <p className="modal-price">
                  ${selectedProduct.price} <span className="price-kes-modal">/ KES {(selectedProduct.price * USD_TO_KES_RATE).toLocaleString()}</span>
                </p>
                
                <div className="modal-description">
                  <h5><i className="bi bi-card-text"></i> Description</h5>
                  <p>{selectedProduct.description || 'Handcrafted with premium materials for comfort and durability.'}</p>
                </div>
                
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="modal-sizes">
                    <h5><i className="bi bi-rulers"></i> Available Sizes</h5>
                    <div className="sizes-grid">
                      {selectedProduct.sizes.map((size, index) => (
                        <span key={index} className="size-badge">{size}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="modal-actions">
                  <button 
                    className="btn-order-whatsapp"
                    onClick={(e) => handleWhatsAppOrderClick(selectedProduct, e)}
                  >
                    <i className="bi bi-whatsapp"></i>
                    Order via WhatsApp
                  </button>
                </div>

                <div className="modal-note">
                  <i className="bi bi-info-circle"></i>
                  <small>Contact us on WhatsApp to confirm size availability and place your order.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && orderProduct && (
        <div className="order-form-overlay" onClick={closeOrderForm}>
          <div className="order-form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="order-form-close" onClick={closeOrderForm} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="order-form-content">
              {/* Compact Header with Product Info */}
              <div className="order-form-header-compact">
                <div className="order-form-product-image-compact">
                  <img 
                    src={orderProduct.image} 
                    alt={orderProduct.title}
                    onError={(e) => { e.target.src = '/assets/denmoda.png'; }}
                  />
                </div>
                <div className="order-form-product-info-compact">
                  <h3 className="order-form-title-compact">{orderProduct.title}</h3>
                  <p className="order-form-price-compact">${orderProduct.price} / KES {(orderProduct.price * USD_TO_KES_RATE).toLocaleString()}</p>
                </div>
              </div>
              
              {/* Form Fields - All Visible */}
              <form onSubmit={handleOrderFormSubmit} className="order-form-compact">
                <div className="order-form-row">
                  <div className="form-group-compact">
                    <label className="form-label-compact">
                      Your Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control-compact"
                      placeholder="Enter your name"
                      value={orderFormData.customerName}
                      onChange={(e) => setOrderFormData({ ...orderFormData, customerName: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className="form-group-compact">
                    <label className="form-label-compact">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control-compact"
                      placeholder="254798257117"
                      value={orderFormData.customerPhone}
                      onChange={(e) => setOrderFormData({ ...orderFormData, customerPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                {orderProduct.sizes && orderProduct.sizes.length > 0 && (
                  <div className="form-group-compact">
                    <label className="form-label-compact">Preferred Size</label>
                    <select
                      className="form-control-compact"
                      value={orderFormData.selectedSize}
                      onChange={(e) => setOrderFormData({ ...orderFormData, selectedSize: e.target.value })}
                    >
                      <option value="">Select size (optional)</option>
                      {orderProduct.sizes.map((size, index) => (
                        <option key={index} value={size}>Size {size}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="order-form-footer-compact">
                  <button type="button" className="order-form-cancel-compact" onClick={closeOrderForm}>
                    <i className="bi bi-x me-2"></i>
                    Cancel
                  </button>
                  <button type="submit" className="order-form-submit-compact">
                    <i className="bi bi-whatsapp me-2"></i>
                    Continue to WhatsApp
                  </button>
                </div>
                
                <div className="order-form-note-compact">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>WhatsApp will open with your order details and product image</small>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
