import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, ShieldAlert, Cpu, Terminal } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error: authError, setError } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);

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

    if (!username || !email || !password || !confirmPassword) {
      setFormError("All credential fields must be filled.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const success = await register(username, email, password);
      if (success) {
        setSuccess(true);
        // Wait 2 seconds and redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      // AuthError will show up via AuthContext
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
      }} className="register-visual-panel">

        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(var(--color-primary-10) 0%, transparent 70%)',
          opacity: 0.1,
          top: '20%',
          right: '10%'
        }} />
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(var(--bg-wine) 0%, transparent 70%)',
          opacity: 0.25,
          top: '10%',
          left: '10%'
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
              Join MarketMind AI.
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
              Create an account to start analyzing stock data with advanced AI, technical indicators, and real-time market sentiment.
            </p>
          </div>
        </div>
      </div>

      {/* Right split screen - Register Box */}
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
              Sign Up
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Create an account to access the dashboard.
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div style={{
              background: 'var(--color-primary-10)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 600
            }}>
              Account created successfully! Redirecting...
            </div>
          )}

          {/* Error Alert */}
          {activeError && !success && (
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
                placeholder="Choose a username"
                className="input-field"
                disabled={loading || success}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field"
                disabled={loading || success}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                disabled={loading || success}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '30px' }}>
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                disabled={loading || success}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', letterSpacing: '1px' }}
              disabled={loading || success}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="glow-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  <span>Registering...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </div>
              )}
            </button>

          </form>

          {/* Login link */}
          <p style={{
            textAlign: 'center',
            marginTop: '25px',
            fontSize: '13px',
            color: 'var(--color-text-muted)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Log In
            </Link>
          </p>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .register-visual-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
