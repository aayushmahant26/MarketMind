import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListOrdered, 
  TrendingUp, 
  BrainCircuit, 
  MessageSquare,
  ChevronLeft,
  Terminal,
  Newspaper
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Watchlist', path: '/watchlist', icon: <ListOrdered size={18} /> },
    { name: 'Stock Details', path: '/stock/RELIANCE', icon: <TrendingUp size={18} /> },
    { name: 'News', path: '/news', icon: <Newspaper size={18} /> },
    { name: 'AI Research', path: '/analyze', icon: <BrainCircuit size={18} /> },
    { name: 'AI Assistant', path: '/chat', icon: <MessageSquare size={18} /> }
  ];


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'var(--bg-dark-60)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            display: 'block'
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`sidebar ${isOpen ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: 'var(--navbar-height)',
          left: 0,
          bottom: 0,
          width: '260px',
          background: 'var(--bg-plum)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--glass-border)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'between',
          zIndex: 999,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Navigation list */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '0 8px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.5px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              Menu
            </span>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-lavender)',
                cursor: 'pointer',
                display: 'none', // Shown in media queries
                alignItems: 'center'
              }}
              className="sidebar-close-btn"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? 'var(--color-primary)' : 'var(--color-white)',
                background: isActive ? 'var(--color-primary-10)' : 'transparent',
                border: isActive ? '1px solid var(--color-primary-20)' : '1px solid transparent',
                textDecoration: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.2s ease-in-out',
                boxShadow: isActive ? '0 0 15px var(--color-primary-10)' : 'none'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'var(--color-muted-10)';
                  e.currentTarget.style.borderColor = 'var(--color-muted-20)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes('var(--color-primary-10')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <span className="icon-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Footer info inside sidebar */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '15px',
          marginTop: 'auto'
        }}>
          <p style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.4',
            margin: 0
          }}>
            MarketMind v1.0.0<br />
            © {new Date().getFullYear()} Indian Markets
          </p>
        </div>
      </aside>

      <style>{`
        /* Media query controls */
        @media (max-width: 1024px) {
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
