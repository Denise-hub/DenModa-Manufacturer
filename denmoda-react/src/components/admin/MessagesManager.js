import React, { useState, useEffect } from 'react';
import * as firestoreService from '../../services/firestoreService';

// Brand colors
const BRAND = {
  navy: '#1a2b4b',
  teal: '#58eecd',
  blue: '#3c74db'
};

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await firestoreService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await firestoreService.updateMessage(id, { isRead: true });
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await firestoreService.updateMessage(id, { isRead: false });
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, isRead: false } : msg
      ));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: false });
      }
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await firestoreService.deleteMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const handleReply = (message) => {
    const subject = encodeURIComponent(`Re: ${message.subject || 'Your inquiry'}`);
    const body = encodeURIComponent(
      `Dear ${message.name},\n\n` +
      `Thank you for contacting DenModa!\n\n` +
      `---\n` +
      `Your original message:\n${message.message}\n` +
      `---\n\n` +
      `Best regards,\nDenModa Team`
    );
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, '_blank');
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

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'read') return msg.isRead;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;

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
    <div className="messages-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1" style={{ color: BRAND.navy }}>
            <i className="bi bi-envelope-fill me-2" style={{ color: BRAND.teal }}></i>
            Messages
          </h2>
          <p className="text-muted mb-0">
            {unreadCount > 0 ? (
              <span className="badge me-2" style={{ background: BRAND.teal, color: BRAND.navy }}>{unreadCount} unread</span>
            ) : null}
            {messages.length} total messages
          </p>
        </div>
        <button 
          className="btn" 
          onClick={fetchMessages}
          style={{ background: BRAND.navy, color: '#fff' }}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="btn-group mb-4">
        <button 
          className="btn"
          onClick={() => setFilter('all')}
          style={{ 
            background: filter === 'all' ? BRAND.navy : '#fff',
            color: filter === 'all' ? '#fff' : BRAND.navy,
            border: `2px solid ${BRAND.navy}`
          }}
        >
          All ({messages.length})
        </button>
        <button 
          className="btn"
          onClick={() => setFilter('unread')}
          style={{ 
            background: filter === 'unread' ? BRAND.teal : '#fff',
            color: filter === 'unread' ? BRAND.navy : BRAND.navy,
            border: `2px solid ${BRAND.teal}`
          }}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className="btn"
          onClick={() => setFilter('read')}
          style={{ 
            background: filter === 'read' ? BRAND.blue : '#fff',
            color: filter === 'read' ? '#fff' : BRAND.blue,
            border: `2px solid ${BRAND.blue}`
          }}
        >
          Read ({messages.length - unreadCount})
        </button>
      </div>

      <div className="row">
        {/* Messages List */}
        <div className={selectedMessage ? 'col-lg-5' : 'col-12'}>
          {filteredMessages.length > 0 ? (
            <div className="list-group" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) handleMarkAsRead(message.id);
                  }}
                  style={{ 
                    cursor: 'pointer',
                    background: selectedMessage?.id === message.id ? BRAND.navy : '#fff',
                    color: selectedMessage?.id === message.id ? '#fff' : BRAND.navy,
                    borderLeft: !message.isRead ? `4px solid ${BRAND.teal}` : 'none'
                  }}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div>
                      <h6 className={`mb-1 ${!message.isRead ? 'fw-bold' : ''}`}>
                        {!message.isRead && <i className="bi bi-circle-fill me-2" style={{ fontSize: '8px', color: BRAND.teal }}></i>}
                        {message.name}
                      </h6>
                      <p className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>
                        <strong>{message.subject || 'No subject'}</strong>
                      </p>
                      <small style={{ opacity: 0.7 }}>
                        {message.email}
                      </small>
                    </div>
                    <small style={{ opacity: 0.7 }}>
                      {formatDate(message.createdAt)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert" style={{ background: `${BRAND.teal}20`, color: BRAND.navy, border: `1px solid ${BRAND.teal}` }}>
              <i className="bi bi-inbox fs-4 me-2"></i>
              {filter === 'all' 
                ? 'No messages yet. Messages from your contact form will appear here.'
                : `No ${filter} messages.`}
            </div>
          )}
        </div>

        {/* Message Detail */}
        {selectedMessage && (
          <div className="col-lg-7">
            <div className="card shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: BRAND.navy, color: '#fff' }}>
                <h5 className="mb-0">{selectedMessage.subject || 'No subject'}</h5>
                <button 
                  className="btn btn-sm"
                  onClick={() => setSelectedMessage(null)}
                  style={{ color: BRAND.teal }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-0" style={{ color: BRAND.navy }}>{selectedMessage.name}</h6>
                    <a href={`mailto:${selectedMessage.email}`} style={{ color: BRAND.blue }}>
                      {selectedMessage.email}
                    </a>
                  </div>
                  <small className="text-muted">{formatDate(selectedMessage.createdAt)}</small>
                </div>

                <hr />

                <div className="message-content mb-4 p-3" style={{ 
                  whiteSpace: 'pre-wrap', 
                  minHeight: '150px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  color: BRAND.navy
                }}>
                  {selectedMessage.message}
                </div>

                <hr />

                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    className="btn"
                    onClick={() => handleReply(selectedMessage)}
                    style={{ background: BRAND.teal, color: BRAND.navy, fontWeight: '600' }}
                  >
                    <i className="bi bi-reply me-1"></i> Reply
                  </button>
                  {selectedMessage.isRead ? (
                    <button 
                      className="btn"
                      onClick={() => handleMarkAsUnread(selectedMessage.id)}
                      style={{ background: '#fff', color: BRAND.navy, border: `2px solid ${BRAND.navy}` }}
                    >
                      <i className="bi bi-envelope me-1"></i> Mark as Unread
                    </button>
                  ) : (
                    <button 
                      className="btn"
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      style={{ background: '#fff', color: BRAND.blue, border: `2px solid ${BRAND.blue}` }}
                    >
                      <i className="bi bi-envelope-open me-1"></i> Mark as Read
                    </button>
                  )}
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManager;

