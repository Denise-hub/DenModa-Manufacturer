import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import * as firestoreService from '../../services/firestoreService';

const AdminDashboard = () => {
  const { products } = useData();
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    todayVisits: 0,
    weeklyGrowth: 0,
    uniqueVisitors: 0,
    mobileVisits: 0,
    desktopVisits: 0
  });
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real analytics data from Firestore
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Get analytics data
        const analyticsData = await firestoreService.getAnalytics(30);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const lastWeekStart = new Date();
        lastWeekStart.setDate(lastWeekStart.getDate() - 14);
        
        // Calculate stats
        const todayVisits = analyticsData.filter(item => {
          const date = item.timestamp?.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
          return date >= todayStart;
        }).length;
        
        const thisWeekVisits = analyticsData.filter(item => {
          const date = item.timestamp?.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
          return date >= weekStart;
        }).length;
        
        const lastWeekVisits = analyticsData.filter(item => {
          const date = item.timestamp?.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
          return date >= lastWeekStart && date < weekStart;
        }).length;
        
        // Calculate growth
        const growth = lastWeekVisits > 0 
          ? Math.round(((thisWeekVisits - lastWeekVisits) / lastWeekVisits) * 100)
          : thisWeekVisits > 0 ? 100 : 0;
        
        // Unique visitors
        const uniqueVisitors = new Set(analyticsData.map(a => a.visitorId)).size;
        
        // Device breakdown
        const mobileVisits = analyticsData.filter(a => a.device === 'mobile').length;
        const desktopVisits = analyticsData.filter(a => a.device === 'desktop').length;
        
        setAnalytics({
          totalVisits: analyticsData.length,
          todayVisits,
          weeklyGrowth: growth,
          uniqueVisitors,
          mobileVisits,
          desktopVisits
        });
        
        // Get messages count
        const messagesData = await firestoreService.getMessages();
        setMessages(messagesData);
        
        // Get orders count
        const ordersData = await firestoreService.getOrders();
        setOrders(ordersData);
        
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Calculate product stats
  const productStats = {
    total: products?.length || 0,
    men: products?.filter(p => p.category === 'man').length || 0,
    women: products?.filter(p => p.category === 'woman').length || 0,
    newArrivals: products?.filter(p => p.category === 'new').length || 0
  };

  const unreadMessages = messages.filter(m => !m.isRead).length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || !o.status).length;

  return (
    <div className="admin-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header mb-4">
        <h2 style={{ color: '#1a2b4b', fontWeight: '700' }}>
          <i className="bi bi-grid-1x2-fill me-2" style={{ color: '#58eecd' }}></i>
          Dashboard
        </h2>
        <p className="text-muted mb-0">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Analytics Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Total Visits */}
        <div className="col-6 col-md-6 col-lg-3">
          <div 
            className="card border-0 h-100"
            style={{ 
              background: 'linear-gradient(135deg, #1a2b4b 0%, #3c74db 100%)',
              borderRadius: '16px'
            }}
          >
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75" style={{ fontSize: '0.75rem' }}>Total Visits (30 days)</p>
                  <h3 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>{loading ? '...' : analytics.totalVisits.toLocaleString()}</h3>
                </div>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center d-none d-md-flex"
                  style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)' }}
                >
                  <i className="bi bi-graph-up fs-5"></i>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge" style={{ background: analytics.weeklyGrowth >= 0 ? 'rgba(88, 238, 205, 0.3)' : 'rgba(255,100,100,0.3)', color: analytics.weeklyGrowth >= 0 ? '#58eecd' : '#ff6464' }}>
                  <i className={`bi bi-arrow-${analytics.weeklyGrowth >= 0 ? 'up' : 'down'}`}></i> {Math.abs(analytics.weeklyGrowth)}% this week
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Visits */}
        <div className="col-6 col-md-6 col-lg-3">
          <div 
            className="card border-0 h-100"
            style={{ 
              background: 'linear-gradient(135deg, #58eecd 0%, #3c74db 100%)',
              borderRadius: '16px'
            }}
          >
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75" style={{ fontSize: '0.75rem' }}>Today's Visits</p>
                  <h3 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>{loading ? '...' : analytics.todayVisits}</h3>
                </div>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center d-none d-md-flex"
                  style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)' }}
                >
                  <i className="bi bi-eye fs-5"></i>
                </div>
              </div>
              <div className="mt-2 mt-md-3">
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
                  <i className="bi bi-people"></i> <span className="d-none d-sm-inline">{analytics.uniqueVisitors} unique</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="col-6 col-md-6 col-lg-3">
          <div 
            className="card border-0 h-100"
            style={{ 
              background: '#fff',
              borderRadius: '16px',
              border: unreadMessages > 0 ? '2px solid #58eecd' : '1px solid rgba(26, 43, 75, 0.1)'
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.75rem' }}>Messages</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#1a2b4b', fontSize: '1.5rem' }}>
                    {messages.length}
                    {unreadMessages > 0 && (
                      <span className="badge ms-2" style={{ background: '#58eecd', color: '#1a2b4b', fontSize: '0.7rem' }}>
                        {unreadMessages} new
                      </span>
                    )}
                  </h3>
                </div>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center d-none d-md-flex"
                  style={{ width: '48px', height: '48px', background: 'rgba(88, 238, 205, 0.15)', color: '#3c74db' }}
                >
                  <i className="bi bi-envelope-fill fs-5"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/messages" className="text-decoration-none small" style={{ color: '#3c74db' }}>
                  View messages <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="col-6 col-md-6 col-lg-3">
          <div 
            className="card border-0 h-100"
            style={{ 
              background: '#fff',
              borderRadius: '16px',
              border: pendingOrders > 0 ? '2px solid #ffc107' : '1px solid rgba(26, 43, 75, 0.1)'
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.75rem' }}>Orders</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#1a2b4b', fontSize: '1.5rem' }}>
                    {orders.length}
                    {pendingOrders > 0 && (
                      <span className="badge ms-2 bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                        {pendingOrders} pending
                      </span>
                    )}
                  </h3>
                </div>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center d-none d-md-flex"
                  style={{ width: '48px', height: '48px', background: 'rgba(60, 116, 219, 0.15)', color: '#3c74db' }}
                >
                  <i className="bi bi-cart-check-fill fs-5"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/orders" className="text-decoration-none small" style={{ color: '#3c74db' }}>
                  View orders <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Breakdown & Quick Actions */}
      <div className="row g-4 mb-4">
        {/* Product Categories */}
        <div className="col-lg-6">
          <div 
            className="card border-0 h-100"
            style={{ borderRadius: '16px', border: '1px solid rgba(26, 43, 75, 0.1)' }}
          >
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="mb-0" style={{ color: '#1a2b4b' }}>
                <i className="bi bi-pie-chart-fill me-2" style={{ color: '#58eecd' }}></i>
                Product Breakdown
              </h5>
            </div>
            <div className="card-body px-4">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between p-3" 
                  style={{ background: 'rgba(26, 43, 75, 0.03)', borderRadius: '12px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', background: '#1a2b4b', color: '#fff' }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                    <span style={{ color: '#1a2b4b', fontWeight: '500' }}>Men's Collection</span>
                  </div>
                  <span className="badge" style={{ background: '#1a2b4b', color: '#fff', fontSize: '14px', padding: '8px 16px' }}>
                    {productStats.men}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3" 
                  style={{ background: 'rgba(88, 238, 205, 0.08)', borderRadius: '12px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', background: '#58eecd', color: '#1a2b4b' }}
                    >
                      <i className="bi bi-person-hearts"></i>
                    </div>
                    <span style={{ color: '#1a2b4b', fontWeight: '500' }}>Women's Collection</span>
                  </div>
                  <span className="badge" style={{ background: '#58eecd', color: '#1a2b4b', fontSize: '14px', padding: '8px 16px' }}>
                    {productStats.women}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3" 
                  style={{ background: 'rgba(60, 116, 219, 0.08)', borderRadius: '12px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', background: '#3c74db', color: '#fff' }}
                    >
                      <i className="bi bi-stars"></i>
                    </div>
                    <span style={{ color: '#1a2b4b', fontWeight: '500' }}>New Arrivals</span>
                  </div>
                  <span className="badge" style={{ background: '#3c74db', color: '#fff', fontSize: '14px', padding: '8px 16px' }}>
                    {productStats.newArrivals}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-6">
          <div 
            className="card border-0 h-100"
            style={{ borderRadius: '16px', border: '1px solid rgba(26, 43, 75, 0.1)' }}
          >
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="mb-0" style={{ color: '#1a2b4b' }}>
                <i className="bi bi-lightning-fill me-2" style={{ color: '#58eecd' }}></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body px-4">
              <div className="d-flex flex-column gap-3">
                <Link 
                  to="/admin/products" 
                  className="btn d-flex align-items-center justify-content-between py-3 px-4"
                  style={{ 
                    background: 'linear-gradient(135deg, #1a2b4b 0%, #3c74db 100%)', 
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none'
                  }}
                >
                  <span><i className="bi bi-plus-circle me-2"></i> Add New Product</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link 
                  to="/admin/team" 
                  className="btn d-flex align-items-center justify-content-between py-3 px-4"
                  style={{ 
                    background: 'linear-gradient(135deg, #58eecd 0%, #3c74db 100%)', 
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none'
                  }}
                >
                  <span><i className="bi bi-person-plus me-2"></i> Add Team Member</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link 
                  to="/admin/messages" 
                  className="btn d-flex align-items-center justify-content-between py-3 px-4"
                  style={{ 
                    background: '#fff', 
                    color: '#1a2b4b',
                    borderRadius: '12px',
                    border: '2px solid #1a2b4b'
                  }}
                >
                  <span><i className="bi bi-chat-dots me-2"></i> View Messages</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link 
                  to="/" 
                  target="_blank"
                  className="btn d-flex align-items-center justify-content-between py-3 px-4"
                  style={{ 
                    background: 'rgba(88, 238, 205, 0.1)', 
                    color: '#1a2b4b',
                    borderRadius: '12px',
                    border: 'none'
                  }}
                >
                  <span><i className="bi bi-eye me-2"></i> View Live Website</span>
                  <i className="bi bi-box-arrow-up-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div 
        className="card border-0"
        style={{ 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(26, 43, 75, 0.03) 0%, rgba(88, 238, 205, 0.05) 100%)',
          border: '1px solid rgba(88, 238, 205, 0.15)'
        }}
      >
        <div className="card-body p-4">
          <h5 className="mb-3" style={{ color: '#1a2b4b' }}>
            <i className="bi bi-lightbulb-fill me-2" style={{ color: '#58eecd' }}></i>
            Tips for Managing Your Store
          </h5>
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex gap-2">
                <i className="bi bi-check-circle-fill" style={{ color: '#58eecd' }}></i>
                <small className="text-muted">Keep product images high quality and consistent</small>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex gap-2">
                <i className="bi bi-check-circle-fill" style={{ color: '#58eecd' }}></i>
                <small className="text-muted">Respond to customer messages promptly</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-2">
                <i className="bi bi-check-circle-fill" style={{ color: '#58eecd' }}></i>
                <small className="text-muted">Update your team info to build trust</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
