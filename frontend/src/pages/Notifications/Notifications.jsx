import { useState } from 'react';
import useNotifications from '../../hooks/useNotifications';
import './Notifications.css';

// User ID test (tạm thời chưa có login)
const USER_ID = 2;

function Notifications() {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  } = useNotifications(USER_ID);

  // Lọc notifications theo filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });

  // Định dạng thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Lấy icon theo loại notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'join_request':
        return '🤝';
      case 'follow':
        return '👤';
      case 'match_accepted':
        return '💕';
      case 'match_request':
        return '❤️';
      case 'activity_request':
        return '⚽';
      case 'activity_approved':
        return '✅';
      case 'activity_rejected':
        return '❌';
      case 'message':
        return '💬';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  // Lấy title theo loại notification
  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case 'join_request':
        return 'Yêu cầu tham gia';
      case 'follow':
        return 'Người theo dõi mới';
      case 'match_accepted':
        return 'Ghép đôi thành công';
      case 'match_request':
        return 'Yêu cầu ghép đôi';
      case 'activity_request':
        return 'Yêu cầu tham gia hoạt động';
      case 'activity_approved':
        return 'Yêu cầu được chấp nhận';
      case 'activity_rejected':
        return 'Yêu cầu bị từ chối';
      case 'message':
        return 'Tin nhắn mới';
      case 'system':
        return 'Thông báo hệ thống';
      default:
        return 'Thông báo';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông báo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-error">
            <p>{error}</p>
            <button onClick={refreshNotifications} className="btn-retry">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <h1>Thông báo</h1>
          <div className="notifications-header-actions">
            {unreadCount > 0 && (
              <button 
                className="btn-mark-all-read"
                onClick={markAllAsRead}
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
            <button 
              className="btn-refresh"
              onClick={refreshNotifications}
            >
              🔄 Làm mới
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="notifications-filter">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
            <span className="count">{notifications.length}</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc
            {unreadCount > 0 && <span className="count unread">{unreadCount}</span>}
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Đã đọc
          </button>
        </div>

        {/* Notifications list */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="empty-icon">🔔</div>
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.notification_id}
                className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <span className="notification-type">
                      {getNotificationTitle(notification)}
                    </span>
                    {!notification.is_read && <span className="unread-dot"></span>}
                  </div>
                  <p className="notification-message">
                    {notification.content || notification.message}
                  </p>
                  <span className="notification-time">
                    {formatTime(notification.created_at)}
                  </span>
                </div>
                <div className="notification-actions">
                  {!notification.is_read && (
                    <button 
                      className="btn-mark-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.notification_id);
                      }}
                      title="Đánh dấu đã đọc"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.notification_id);
                    }}
                    title="Xóa thông báo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
