import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductsManager from '../components/admin/ProductsManager';
import TeamManager from '../components/admin/TeamManager';
import ContactManager from '../components/admin/ContactManager';
import SettingsManager from '../components/admin/SettingsManager';
import MessagesManager from '../components/admin/MessagesManager';
import OrdersManager from '../components/admin/OrdersManager';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Simplified menu focusing on essential admin tasks
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill', exact: true },
    { path: '/admin/products', label: 'Products', icon: 'bi-bag-fill' },
    { path: '/admin/orders', label: 'Orders', icon: 'bi-cart-check-fill' },
    { path: '/admin/team', label: 'Team', icon: 'bi-people-fill' },
    { path: '/admin/messages', label: 'Messages', icon: 'bi-envelope-fill' },
    { path: '/admin/contact', label: 'Contact Info', icon: 'bi-telephone-fill' },
    { path: '/admin/settings', label: 'Settings', icon: 'bi-gear-fill' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="admin-layout d-flex">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header p-3 d-flex align-items-center justify-content-between">
          <Link to="/" className="text-decoration-none">
            <h4 className="m-0 d-flex align-items-center" style={{ color: '#58eecd' }}>
              <img 
                src={process.env.PUBLIC_URL + '/assets/favicon.png'} 
                alt="DenModa" 
                style={{ height: '30px', marginRight: '5px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ color: '#3c74db' }}>Den</span>
              <span style={{ color: '#58eecd' }}>Moda</span>
            </h4>
          </Link>
          <button 
            className="btn btn-link d-lg-none text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="list-unstyled m-0">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 ${
                    isActive(item.path, item.exact) ? 'active' : ''
                  }`}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer p-3">
          <div className="user-info d-flex align-items-center gap-2 mb-3">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#3c74db',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName} 
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = (user?.displayName?.[0] || user?.email?.[0] || 'A').toUpperCase();
                  }}
                />
              ) : (
                (user?.displayName?.[0] || user?.email?.[0] || 'A').toUpperCase()
              )}
            </div>
            <div>
              <small className="d-block text-white-50">Logged in as</small>
              <span className="text-white">{user?.displayName || user?.email}</span>
            </div>
          </div>
          <button 
            className="btn w-100"
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#58eecd', 
              color: '#1a2b4b',
              fontWeight: '600',
              border: 'none'
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main flex-grow-1">
        {/* Top Bar */}
        <header className="admin-topbar d-flex align-items-center justify-content-between px-4 py-3">
          <button 
            className="btn btn-link d-lg-none"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-outline-primary btn-sm" target="_blank">
              <i className="bi bi-eye"></i> View Site
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content p-4">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="contact" element={<ContactManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay d-lg-none"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminPage;

