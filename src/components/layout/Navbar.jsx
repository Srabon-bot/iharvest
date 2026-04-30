import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, User, LogOut, ChevronDown, Lock, Shield } from 'lucide-react';
import { logoutUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import NotificationDropdown from '../ui/NotificationDropdown';
import ChangePasswordModal from '../ui/ChangePasswordModal';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, userProfile } = useAuth();
  
  // Clean up display name logic
  let displayName = 'Guest User';
  if (userProfile?.name) {
    // If it starts with "Mock", remove it to feel like production
    displayName = userProfile.name.replace(/^Mock\s+/i, '');
  } else if (user?.displayName) {
    displayName = user.displayName;
  } else if (user?.email) {
    displayName = user.email.split('@')[0];
  }

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setProfileOpen(false);
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
        <NotificationDropdown />
        
        <div className="navbar-user-dropdown" ref={profileRef} style={{ position: 'relative' }}>
          <button 
            className="navbar-user-btn" 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)' }}
          >
            <div className="user-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                <User size={18} color="var(--text-secondary)" />
              )}
            </div>
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="user-name" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{userProfile?.role || 'User'}</span>
            </div>
            <ChevronDown size={16} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {profileOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, width: '220px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{displayName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
              <div style={{ padding: '0.5rem 0' }}>
                <button onClick={() => { setPasswordModalOpen(true); setProfileOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
                  <Lock size={16} color="var(--text-secondary)" /> Change Password
                </button>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                <button onClick={handleLogout} disabled={isLoggingOut} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
                  <LogOut size={16} /> {isLoggingOut ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
