import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Zap, TrendingUp, Search, Newspaper } from 'lucide-react';

const AiAssistantPrompt = () => {
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState('');

  const handleAiShortcutSubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    navigate('/analyze', { state: { prefilledQuery: aiQuery.trim() } });
  };

  const handleSuggestionClick = (queryText) => {
    navigate('/analyze', { state: { prefilledQuery: queryText } });
  };

  const suggestions = [
    { label: 'Analyze NIFTY', query: 'Analyze NIFTY for tomorrow', icon: <TrendingUp size={12} color="var(--color-amber)" /> },
    { label: 'RELIANCE Trend', query: 'What is the trend of RELIANCE?', icon: <Search size={12} color="var(--color-primary)" /> },
    { label: 'Analyze TCS', query: 'Analyze TCS for tomorrow', icon: <TrendingUp size={12} color="var(--color-amber)" /> },
    { label: 'Analyse Infosys', query: 'Analyze Infosys for tomorrow ', icon: <TrendingUp size={12} color="var(--color-amber)" /> }
  ];

  return (
    <div className="glass-card gold-glow" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 30px',
      background: 'var(--bg-plum)',
      height: '100%',
      minHeight: '400px'
    }}>
      {/* Top Status Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '12px',
        marginBottom: '16px'
      }}>
        <span className="badge badge-bullish" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          textTransform: 'none',
          fontSize: '11px',
          fontWeight: '600',
          padding: '4px 8px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--color-amber)',
            display: 'inline-block',
            animation: 'pulse 1.8s infinite ease-in-out'
          }}></span>
          AI Agent Online
        </span>

      </div>

      {/* Middle Content Group */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '12px' }}>
          <BrainCircuit size={24} />
          <h3 style={{ fontSize: '20px', fontWeight: 600 }}>Ask AI Assistant</h3>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
          Type any question about NIFTY or specific Indian stocks (e.g., "Analyze NIFTY for tomorrow" or "What is the trend of RELIANCE?"). The AI will analyze market news, technical indicators, and key metrics to generate a detailed report.
        </p>

        <form onSubmit={handleAiShortcutSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="e.g. Analyze NIFTY for tomorrow..."
            className="input-field"
            style={{ flexGrow: 1, background: 'var(--bg-dark-80)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} />
            <span>Analyze</span>
          </button>
        </form>
      </div>

      {/* Suggested Queries Footer */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '16px',
        marginTop: '16px'
      }}>
        <span style={{
          display: 'block',
          fontSize: '12px',
          color: 'var(--color-lavender)',
          marginBottom: '10px',
          fontWeight: 500,
          fontFamily: 'Outfit, sans-serif'
        }}>
          Suggested queries:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s.query)}
              style={{
                background: 'var(--bg-dark-60)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                padding: '6px 12px',
                color: 'var(--color-white)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.background = 'var(--color-primary-10)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.background = 'var(--bg-dark-60)';
              }}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPrompt;
