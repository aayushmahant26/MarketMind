import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, ShieldAlert, Cpu, Terminal, TrendingUp, AlertTriangle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading, error: authError, setError } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Clear errors on mount
  useEffect(() => {
    setError(null);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!username || !password) {
      setFormError("All credentials must be supplied.");
      return;
    }

    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      // AuthContext sets error state which is displayed via authError
    } finally {
      setLoading(false);
    }
  };

  const activeError = formError || authError;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-dark)',
      overflow: 'hidden'
    }} className="animate-fade-in">

      {/* Left split screen - Visual Telemetry Illustration */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, var(--bg-plum) 0%, var(--bg-dark) 50%, var(--bg-wine) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        borderRight: '1px solid var(--glass-border)'
      }} className="login-visual-panel">

        {/* Glow dots behind */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(var(--color-primary-10) 0%, transparent 70%)',
          opacity: 0.1,
          top: '10%',
          left: '10%'
        }} />
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(var(--bg-wine) 0%, transparent 70%)',
          opacity: 0.25,
          bottom: '10%',
          right: '10%'
        }} />

        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--bg-wine) 100%)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--color-primary-20)'
            }}>
              <Cpu size={22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '26px',
              letterSpacing: '1px',
              background: 'linear-gradient(90deg, #FFFFFF, var(--color-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MarketMind AI
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: '1.2' }}>
              AI-Powered Stock Research for Indian Markets.
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
              Harness AI networks to analyze NIFTY, BANKNIFTY, and equities with technical indicators, news sentiment, and real-time insights.
            </p>
          </div>
        </div>
      </div>

      {/* Right split screen - Login Box */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ marginBottom: '35px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-white)', marginBottom: '8px' }}>
              Log In
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Please enter your credentials to log in.
            </p>
          </div>

          {/* Alert Block */}
          {activeError && (
            <div style={{
              background: 'var(--color-bearish-10)',
              border: '1px solid var(--color-coral)',
              color: 'var(--color-coral)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <div>{activeError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '30px' }}>

            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                className="input-field"
                disabled={loading || authLoading}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '30px' }}>
              <label className="input-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                disabled={loading || authLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', letterSpacing: '1px' }}
              disabled={loading || authLoading}
            >
              {(loading || authLoading) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="glow-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  <span>Logging In...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LogIn size={16} />
                  <span>Log In</span>
                </div>
              )}
            </button>

          </form>

          {/* Footer toggle */}
          <p style={{
            textAlign: 'center',
            marginTop: '25px',
            fontSize: '13px',
            color: 'var(--color-text-muted)'
          }}>
            Don't Have an Account ? {' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Create One
            </Link>
          </p>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-visual-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
