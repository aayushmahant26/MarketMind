import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#2B124C',
        color: '#F6F1F1',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(155, 126, 189, 0.2)',
          borderTop: '3px solid #F9B800',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '15px'
        }}></div>
        <p style={{ color: '#9B7EBD', letterSpacing: '2px', fontSize: '14px' }}>VERIFYING CREDENTIALS...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
