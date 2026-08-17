import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Menu, LogOut, User, Activity, Sun, Moon } from 'lucide-react';

const Navbar = ({ onToggleSidebar, pageTitle }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      height: 'var(--navbar-height)',
      background: 'var(--bg-dark-80)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      zIndex: 999,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    }}>
      {/* Left section: Toggle Menu & Brand/Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={onToggleSidebar}
          className="navbar-toggle-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-white)',
            cursor: 'pointer',
            display: 'none', // Shown in media queries
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px'
          }}
        >
          <Menu size={24} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--bg-wine) 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px var(--color-primary-20)'
          }}>
            <Activity size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
            <span className="logo-text">
              MarketMind
            </span>
          </div>
        
        <div style={{
          height: '20px',
          width: '1px',
          background: 'var(--glass-border)',
          margin: '0 15px'
        }} className="navbar-divider"></div>
        
        <h2 style={{
          fontSize: '16px',
          fontFamily: 'Outfit, sans-serif',
          color: 'var(--color-white)',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }} className="navbar-page-title">
          {pageTitle || 'System'}
        </h2>
      </div>

      {/* Right section: Profile & Logout */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--color-muted-10)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary-10)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-muted-10)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            type="button"
          >
            {theme === 'dark' ? <Sun size={18} color="var(--color-white)" /> : <Moon size={18} color="var(--color-white)" />}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--color-muted-10)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--bg-wine) 0%, var(--color-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={12} color="#F6F1F1" />
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-white)',
              fontFamily: 'Outfit, sans-serif'
            }}>
              {user.username}
            </span>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'var(--color-bearish-10)',
              border: '1px solid var(--color-bearish-30)',
              color: 'var(--color-coral)',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-coral)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 10px var(--color-bearish-20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bearish-10)';
              e.currentTarget.style.color = 'var(--color-coral)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      )}
      
      <style>{`
        @media (max-width: 1024px) {
          .navbar-toggle-btn {
            display: flex !important;
          }
          .navbar-divider, .navbar-page-title {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
