import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { logoutUser } from '../../services/authService';
import './Navbar.css';

const Navbar = ({ toggleSidebar, user }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>
      
      <div className="navbar-right">
        <button className="navbar-icon-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="navbar-user">
          <div className="user-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User avatar" />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.displayName || user?.name || user?.email || 'Guest User'}</span>
          </div>
        </div>

        <button 
          className="navbar-icon-btn logout-btn" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Log Out"
          style={{ marginLeft: 'var(--spacing-2)', color: 'var(--danger)', opacity: isLoggingOut ? 0.5 : 1 }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
