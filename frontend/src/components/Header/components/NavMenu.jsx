import React from 'react';
import { Link } from 'react-router-dom';

function NavMenu() {
  return (
    <nav className="nav-menu">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/match">Match</Link>
        </li>
        <li>
          <Link to="/friends">Friends</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavMenu;
