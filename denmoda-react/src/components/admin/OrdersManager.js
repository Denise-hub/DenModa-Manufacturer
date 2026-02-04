import React, { useState, useEffect } from 'react';
import * as firestoreService from '../../services/firestoreService';

// Brand colors
const BRAND = {
  navy: '#1a2b4b',
  teal: '#58eecd',
  blue: '#3c74db'
};

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, delivered, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await firestoreService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, orderTitle) => {
    try {
      await firestoreService.updateOrder(id, { status });
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
      // Show success message with status badge
      const statusLabels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      };
      
      alert(`✅ Order status updated successfully!\n\nOrder: ${orderTitle || 'N/A'}\nNew Status: ${statusLabels[status] || status}`);
      
      // Refresh orders to ensure consistency
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('❌ Failed to update order status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    
    try {
      await firestoreService.deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const handleContactCustomer = (order) => {
    const phoneNumber = order.customerPhone?.replace(/[^\d]/g, '') || '254798257117';
    const message = encodeURIComponent(
      `Hello ${order.customerName || 'Customer'}!\n\n` +
      `This is DenModa following up on your order:\n` +
      `Product: ${order.productTitle}\n` +
      `Price: $${order.productPrice}\n` +
      `Size: ${order.selectedSize || 'Not specified'}\n\n` +
      `How can we help you today?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: '#ffc107', color: '#1a2b4b', label: 'Pending', icon: 'bi-clock' },
      confirmed: { bg: BRAND.blue, color: '#fff', label: 'Confirmed', icon: 'bi-check-circle' },
      processing: { bg: BRAND.navy, color: '#fff', label: 'Processing', icon: 'bi-gear' },
      shipped: { bg: '#6c757d', color: '#fff', label: 'Shipped', icon: 'bi-truck' },
      delivered: { bg: BRAND.teal, color: BRAND.navy, label: 'Delivered', icon: 'bi-check2-all' },
      cancelled: { bg: '#dc3545', color: '#fff', label: 'Cancelled', icon: 'bi-x-circle' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className="badge" style={{ background: badge.bg, color: badge.color, padding: '8px 12px' }}>
        <i className={`bi ${badge.icon} me-1`}></i>
        {badge.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending' || !o.status).length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1" style={{ color: BRAND.navy }}>
            <i className="bi bi-cart-check-fill me-2" style={{ color: BRAND.teal }}></i>
            Customer Orders
          </h2>
          <p className="text-muted mb-0">
            {statusCounts.pending > 0 && (
              <span className="badge me-2" style={{ background: '#ffc107', color: BRAND.navy }}>{statusCounts.pending} pending</span>
            )}
            {orders.length} total orders
          </p>
        </div>
        <button 
          className="btn" 
          onClick={fetchOrders}
          style={{ background: BRAND.navy, color: '#fff' }}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap" style={{ gap: '0.5rem' }}>
        {[
          { key: 'all', label: 'All', color: BRAND.navy },
          { key: 'pending', label: 'Pending', color: '#ffc107' },
          { key: 'confirmed', label: 'Confirmed', color: BRAND.blue },
          { key: 'delivered', label: 'Delivered', color: BRAND.teal },
          { key: 'cancelled', label: 'Cancelled', color: '#dc3545' }
        ].map(({ key, label, color }) => (
          <button 
            key={key}
            className="btn"
            onClick={() => setFilter(key)}
            style={{ 
              background: filter === key ? color : '#fff',
              color: filter === key ? (key === 'delivered' || key === 'pending' ? BRAND.navy : '#fff') : color,
              border: `2px solid ${color}`,
              fontWeight: '500',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              whiteSpace: 'nowrap',
              flex: '1 1 auto',
              minWidth: 'fit-content'
            }}
          >
            <span className="d-none d-sm-inline">{label} </span>({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="table-responsive" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: BRAND.navy, color: '#fff' }}>
              <tr>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Size</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <small>{formatDate(order.createdAt)}</small>
                  </td>
                  <td>
                    <div>
                      <strong>{order.customerName || 'Unknown'}</strong>
                      {order.customerPhone && (
                        <small className="d-block text-muted">{order.customerPhone}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {order.productImage && (
                        <img 
                          src={order.productImage} 
                          alt={order.productTitle}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="text-truncate" style={{ maxWidth: '150px' }}>
                        {order.productTitle || 'Unknown Product'}
                      </span>
                    </div>
                  </td>
                  <td>{order.selectedSize || '-'}</td>
                  <td>
                    <strong>${order.productPrice || 0}</strong>
                    {order.priceKES && (
                      <small className="d-block text-muted">KES {order.priceKES}</small>
                    )}
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-sm"
                        onClick={() => handleContactCustomer(order)}
                        title="Contact via WhatsApp"
                        style={{ background: '#25D366', color: '#fff' }}
                      >
                        <i className="bi bi-whatsapp"></i>
                      </button>
                      <div className="dropdown">
                        <button 
                          type="button" 
                          className="btn btn-sm dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          title="Update Status"
                          style={{ background: BRAND.blue, color: '#fff' }}
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li className="dropdown-header" style={{ color: BRAND.navy }}>Update Status</li>
                          <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order.id, 'pending', order.productTitle)}><i className="bi bi-clock me-2 text-warning"></i>Pending</button></li>
                          <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order.id, 'confirmed', order.productTitle)}><i className="bi bi-check-circle me-2 text-info"></i>Confirmed</button></li>
                          <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order.id, 'processing', order.productTitle)}><i className="bi bi-gear me-2 text-primary"></i>Processing</button></li>
                          <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order.id, 'shipped', order.productTitle)}><i className="bi bi-truck me-2 text-secondary"></i>Shipped</button></li>
                          <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order.id, 'delivered', order.productTitle)}><i className="bi bi-check2-all me-2 text-success"></i>Delivered</button></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><button className="dropdown-item text-danger" onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel this order?\n\nOrder: ${order.productTitle}\nCustomer: ${order.customerName || 'N/A'}`)) {
                              handleUpdateStatus(order.id, 'cancelled', order.productTitle);
                            }
                          }}><i className="bi bi-x-circle me-2"></i>Cancelled</button></li>
                        </ul>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(order.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          <div className="d-flex align-items-center">
            <i className="bi bi-box-seam fs-1 me-3"></i>
            <div>
              <h5 className="mb-1">No orders found</h5>
              <p className="mb-0">
                {filter === 'all' 
                  ? 'When customers place orders via WhatsApp, they will appear here for tracking.'
                  : `No ${filter} orders at the moment.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mt-4 g-3">
        <div className="col-md-3 col-sm-6 col-6">
          <div className="card border-0" style={{ background: '#ffc107', borderRadius: '12px' }}>
            <div className="card-body text-center" style={{ color: BRAND.navy }}>
              <i className="bi bi-clock fs-4 mb-2"></i>
              <h3 className="mb-0">{statusCounts.pending}</h3>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 col-6">
          <div className="card border-0 text-white" style={{ background: BRAND.blue, borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-check-circle fs-4 mb-2"></i>
              <h3 className="mb-0">{statusCounts.confirmed}</h3>
              <small>Confirmed</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 col-6">
          <div className="card border-0" style={{ background: BRAND.teal, borderRadius: '12px' }}>
            <div className="card-body text-center" style={{ color: BRAND.navy }}>
              <i className="bi bi-check2-all fs-4 mb-2"></i>
              <h3 className="mb-0">{statusCounts.delivered}</h3>
              <small>Delivered</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 col-6">
          <div className="card border-0 text-white" style={{ background: '#dc3545', borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-x-circle fs-4 mb-2"></i>
              <h3 className="mb-0">{statusCounts.cancelled}</h3>
              <small>Cancelled</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersManager;

