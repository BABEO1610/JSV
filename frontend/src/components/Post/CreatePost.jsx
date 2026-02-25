import { useState } from 'react';
import useCreatePost from '../../hooks/useCreatePost';

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const { createPost, loading, error } = useCreatePost(() => {
    setContent('');
    onPostCreated();
  });

  return (
    <div className="create-post">
      <textarea
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={() => createPost(content)} disabled={loading}>
        {loading ? 'Đang đăng...' : 'Đăng bài'}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreatePost;