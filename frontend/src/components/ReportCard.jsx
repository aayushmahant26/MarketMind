import React from 'react';
import { cleanSymbol } from '../utils/formatters';
import {
  TrendingUp,
  ShieldAlert,
  Cpu,
  Newspaper,
  Award,
  ArrowUpDown,
  Terminal
} from 'lucide-react';

const ReportCard = ({ reportText, query, symbol, date }) => {
  const displaySymbol = cleanSymbol(symbol);


  const cleanReportText = reportText ? reportText.replace(/\*\*/g, '') : '';  // Removes the ** from the report text

  // Parser to extract sections from the text report
  const parseReport = (text) => {
    if (!text) return null;

    const sections = {
      trend: '',
      confidence: '',
      support: '',
      resistance: '',
      risk: '',
      technicalSummary: '',
      newsSummary: '',
      recommendation: '',
    };

    const markers = [
      { key: 'trend', label: 'Trend:' },
      { key: 'confidence', label: 'Confidence:' },
      { key: 'support', label: 'Support:' },
      { key: 'resistance', label: 'Resistance:' },
      { key: 'risk', label: 'Risk:' },
      { key: 'technicalSummary', label: 'Technical Summary:' },
      { key: 'newsSummary', label: 'News Summary:' },
      { key: 'recommendation', label: 'Recommendation:' }
    ];

    let hasMatches = false;

    markers.forEach((marker, idx) => {
      const labelEscaped = marker.label.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Look for the marker label and capture everything up to the next marker or end of string
      const regex = new RegExp(`${labelEscaped}\\s*([\\s\\S]*?)(?=(?:${markers.map(m => m.label.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})|$)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        sections[marker.key] = match[1].trim();
        hasMatches = true;
      }
    });

    return hasMatches ? sections : null;
  };

  const parsed = parseReport(cleanReportText);

  // Helper function to highlight important keywords dynamically in a theme-conforming way
  const highlightKeywords = (text) => {
    if (!text) return '';

    const keywords = [
      { regex: /\b(?:bullish|buy|strong buy)\b/ig, color: 'var(--color-amber)', weight: '700' },
      { regex: /\b(?:bearish|sell|strong sell|high risk)\b/ig, color: 'var(--color-coral)', weight: '700' },
      { regex: /\b(?:sideways|hold|medium risk|low risk)\b/ig, color: 'var(--color-primary)', weight: '700' }
    ];

    let parts = [text];

    keywords.forEach(({ regex, color, weight }) => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }

        const splitParts = part.split(regex);
        const matches = part.match(regex);

        if (matches) {
          splitParts.forEach((sp, i) => {
            newParts.push(sp);
            if (i < matches.length) {
              newParts.push(
                <span key={`${color}-${i}-${matches[i]}`} style={{ color, fontWeight: weight }}>
                  {matches[i]}
                </span>
              );
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  // If parsing fails or is incomplete, fallback to raw rendering
  if (!parsed) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '15px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-white)', fontWeight: 600 }}>AI Market Report</h3>
            <span style={{ fontSize: '12px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif' }}>
              Query: "{query}"
            </span>
          </div>
          <span className="badge badge-neutral">{displaySymbol}</span>
        </div>
        <div style={{
          background: 'var(--bg-dark-60)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '14px',
          color: 'var(--color-white)',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', marginBottom: '10px' }}>
            <Terminal size={14} />
            <span>Raw Report Data</span>
          </div>
          {cleanReportText}
        </div>
      </div>
    );
  }

  const isBullish = parsed.trend.toLowerCase().includes('bull') || parsed.recommendation.toLowerCase().includes('buy');
  const isBearish = parsed.trend.toLowerCase().includes('bear') || parsed.recommendation.toLowerCase().includes('sell');

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>

      {/* Header Info */}
      <div style={{
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
            AI Research Report • {date ? new Date(date).toLocaleString() : 'Live'}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '3px', color: 'var(--color-white)' }}>
            {displaySymbol} Analysis
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
            Query: "{query}"
          </p>
        </div>
        <span className={`badge ${isBullish ? 'badge-bullish' : (isBearish ? 'badge-bearish' : 'badge-neutral')}`} style={{ fontSize: '11px', padding: '5px 10px' }}>
          {parsed.trend}
        </span>
      </div>

      {/* Key Metrics Dashboard Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        background: 'var(--bg-dark-60)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-lavender)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
            <TrendingUp size={12} />
            <span>Trend Bias</span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-white)', marginTop: '4px' }}>
            {highlightKeywords(parsed.trend)}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-lavender)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
            <Terminal size={12} />
            <span>Confidence</span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
            {parsed.confidence}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-coral)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
            <ArrowUpDown size={12} />
            <span>Support</span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-white)', marginTop: '4px' }}>
            {parsed.support.includes('₹') ? parsed.support : `₹${parsed.support}`}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-amber)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
            <ArrowUpDown size={12} />
            <span>Resistance</span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-white)', marginTop: '4px' }}>
            {parsed.resistance.includes('₹') ? parsed.resistance : `₹${parsed.resistance}`}
          </p>
        </div>
      </div>

      {/* Main Narrative Report Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px', lineHeight: '1.6' }}>

        {parsed.technicalSummary && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-white)', fontWeight: 600, marginBottom: '6px' }}>
              <Cpu size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technical Summary</span>
            </div>
            <p style={{ color: 'var(--color-lavender)', paddingLeft: '22px' }}>
              {highlightKeywords(parsed.technicalSummary)}
            </p>
          </div>
        )}

        {parsed.newsSummary && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-white)', fontWeight: 600, marginBottom: '6px' }}>
              <Newspaper size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Market Sentiment</span>
            </div>
            <p style={{ color: 'var(--color-lavender)', paddingLeft: '22px' }}>
              {highlightKeywords(parsed.newsSummary)}
            </p>
          </div>
        )}

        {parsed.risk && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-white)', fontWeight: 600, marginBottom: '6px' }}>
              <ShieldAlert size={14} color="var(--color-coral)" />
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Profile</span>
            </div>
            <p style={{ color: 'var(--color-lavender)', paddingLeft: '22px' }}>
              {highlightKeywords(parsed.risk)}
            </p>
          </div>
        )}

        {parsed.recommendation && (
          <div style={{
            marginTop: '10px',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'var(--color-primary-10)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '6px' }}>
              <Award size={16} />
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Recommendation</span>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-white)' }}>
              {highlightKeywords(parsed.recommendation)}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportCard;
