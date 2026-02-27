import { useState } from 'react';
import CreatePost from '../../components/Post/CreatePost';
import useListPost from '../../hooks/useListPost';
import PendingGroup from '../../components/ListWaitingGroup/PendingGroup.jsx';
import './Home.css';

function Home() {
  const [reload, setReload] = useState(0);
  const { posts, loading, error } = useListPost();

  const reloadPosts = () => {
    setReload((prev) => prev + 1);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  return (
    <div className="home-page">
      <div className="create-post-wrapper">
        <CreatePost onPostCreated={reloadPosts} />
      </div>
      
      <div className="home-sidebar-left">
        <div className='PendingGroup'>
          <PendingGroup />
        </div>
      </div>
      <div className="posts-list">
        {loading && <p className="loading">Đang tải...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && posts.length === 0 && <p className="no-posts">Chưa có bài viết nào</p>}
        {posts.map((post) => (
          <div key={post.status_id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <div className="avatar-container">
                  <div className="avatar-inner">
                    <img 
                      src={post.avatar_url || 'https://i.pravatar.cc/150?img=1'} 
                      alt={post.username || 'User'} 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="user-info">
                  <h2>
                    {post.full_name || post.username || 'Người dùng'}
                    <span className="user-badge">Bóng đá f8</span>
                    <span className="online-dot"></span>
                  </h2>
                  <span className="post-time">
                    {getTimeAgo(post.created_at)}
                  </span>
                </div>
              </div>
              <button className="star-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
            </div>

            <div className="post-media">
              {post.image_url ? (
                <img src={post.image_url} alt="Post" />
              ) : (
                <span className="post-placeholder">
                  {post.content || 'Content'}
                </span>
              )}
            </div>

            {!post.image_url && post.content && (
              <p className="post-content-text">
                {post.content}
              </p>
            )}

            <div className="post-actions">
              <button className="btn-join">
                Tham gia
              </button>
              <button className="btn-message">
                Nhắn tin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
