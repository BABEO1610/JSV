import { useState } from 'react';
import CreatePost from '../../components/Post/CreatePost';


import React from 'react';
import './Home.css';
import PendingGroup from '../../components/ListWaitingGroup/PendingGroup.jsx';
function Home() {
  const [reload, setReload] = useState(0);

  const reloadPosts = () => {
    setReload((prev) => prev + 1);
  };

  return (
    <div className="home-page">
      <CreatePost onPostCreated={reloadPosts} />
      
      <div className="home-sidebar-left">
        <div className='PendingGroup'>
          <PendingGroup />
        </div>
      </div>
    </div>
  );
}

export default Home;