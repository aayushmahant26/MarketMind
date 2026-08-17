import React from 'react';
import { Gauge, AlertCircle } from 'lucide-react';

const TechnicalAnalysisWidget = ({ technical }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--color-lavender)'
      }}>
        <Gauge size={18} />
        <h3 style={{ fontSize: '16px', letterSpacing: '0.5px', fontWeight: 600 }}>Technical Analysis</h3>
      </div>

      {technical ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Trend Gauge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>Trend:</span>
            <span className={`badge ${technical.trend === 'Bullish' ? 'badge-bullish' : (technical.trend === 'Bearish' ? 'badge-bearish' : 'badge-neutral')}`} style={{ fontSize: '13px', padding: '4px 10px' }}>
              {technical.trend}
            </span>
          </div>

          {/* RSI circular gauge widget */}
          <div>
            {(() => {
              const rsi = technical.rsi;
              let rsiColor = 'var(--color-primary)';
              let rsiLabel = 'Neutral';
              let badgeClass = 'badge-neutral';
              
              if (rsi > 70) {
                rsiColor = 'var(--color-coral)';
                rsiLabel = 'Overbought';
                badgeClass = 'badge-bearish';
              } else if (rsi < 30) {
                rsiColor = 'var(--color-amber)';
                rsiLabel = 'Oversold';
                badgeClass = 'badge-bullish';
              }
              
              const radius = 28;
              const strokeWidth = 5;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (Math.min(Math.max(rsi, 0), 100) / 100) * circumference;

              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'var(--bg-card-40)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '16px',
                  marginTop: '5px'
                }}>
                  {/* SVG Radial Gauge */}
                  <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      {/* Track Circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="var(--bg-wine)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke={rsiColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 32 32)"
                        style={{
                          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                      {/* Center Text */}
                      <text
                        x="32"
                        y="35"
                        textAnchor="middle"
                        fill="var(--color-white)"
                        style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          fontFamily: 'Outfit, sans-serif'
                        }}
                      >
                        {Math.round(rsi)}
                      </text>
                    </svg>
                  </div>

                  {/* Info Panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      RSI (14) Strength
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif' }}>
                      {rsi.toFixed(2)}
                    </span>
                    <span className={`badge ${badgeClass}`} style={{ alignSelf: 'flex-start', fontSize: '9px', padding: '2px 6px', fontWeight: 700 }}>
                      {rsiLabel}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* MACD */}
          <div style={{
            background: 'var(--bg-card-40)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>MACD Value</span>
              <p style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', color: 'var(--color-white)', marginTop: '4px' }}>
                {technical.macd.toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>MACD Signal</span>
              <p style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', color: 'var(--color-lavender)', marginTop: '4px' }}>
                {technical.signal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Support & Resistance Bands */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>Support & Resistance Levels</span>
            <div style={{
              background: 'var(--bg-card-40)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--color-coral)', fontWeight: 600 }}>Resistance:</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--color-white)', fontWeight: 500 }}>₹{technical.resistance.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--color-amber)', fontWeight: 600 }}>Support:</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--color-white)', fontWeight: 500 }}>₹{technical.support.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Moving averages */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            fontSize: '11px'
          }}>
            <div style={{ background: 'var(--bg-card-40)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>EMA 20</span>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif', marginTop: '3px' }}>
                ₹{technical.ema_20.toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{ background: 'var(--bg-card-40)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>SMA 50</span>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif', marginTop: '3px' }}>
                ₹{technical.sma_50.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-coral)', justifyContent: 'center', margin: 'auto' }}>
          <AlertCircle size={16} />
          <span style={{ fontSize: '12px' }}>Technicals offline</span>
        </div>
      )}
    </div>
  );
};

export default TechnicalAnalysisWidget;
