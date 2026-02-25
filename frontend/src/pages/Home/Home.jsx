import { useState } from 'react';
import CreatePost from '../../components/Post/CreatePost';


function Home() {
  const [reload, setReload] = useState(0);

  const reloadPosts = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="home-page">
      <CreatePost onPostCreated={reloadPosts} />
      
    </div>
  );
}

export default Home;