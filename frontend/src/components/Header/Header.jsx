import React from 'react';
import './Header.css';
import NavMenu from './components/NavMenu';
import NotificationIcon from './components/NotificationIcon';
import UserMenu from './components/UserMenu';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>JSV</h1>
        </div>
        <NavMenu />
        <div className="header-actions">
          <NotificationIcon />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
