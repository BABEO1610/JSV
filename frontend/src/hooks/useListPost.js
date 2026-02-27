import { useState, useEffect } from 'react';
import { listService } from '../services/ListService';

function useListPost() {
 const [posts, setPosts] = useState([]);
 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
   const fetchPosts = async () => {
    try {
        setLoading(true);
        const data = await listService.getListPost();
        setPosts(data);
        
    }catch (err) {
        setError('Lấy danh sách bài viết thất bại');
    } finally {
        setLoading(false);
    }
   };
   fetchPosts();
 }, []);
 
 return {
    posts,
    error,
    loading
  };
}
export default useListPost;
