import React from 'react';

const StockQuoteSummary = ({
  price,
  isPositiveTrend,
  percentChange,
  low,
  high,
  technical,
  stockInfo
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    }}>
      
      {/* Quote Price */}
      <div className="glass-card gold-glow" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Last Price</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
            ₹{price ? price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : 'N/A'}
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: isPositiveTrend ? 'var(--color-amber)' : 'var(--color-coral)'
          }}>
            {isPositiveTrend ? '+' : ''}{percentChange.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Intraday Range */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>High / Low</span>
        <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', margin: '4px 0' }}>
          ₹{low ? low.toLocaleString('en-IN') : 'N/A'} - ₹{high ? high.toLocaleString('en-IN') : 'N/A'}
        </span>
        {/* Progress gauge slider */}
        {price && high && low && high !== low && (
          <div style={{ height: '3px', background: 'var(--bg-dark-60)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              left: `${((price - low) / (high - low)) * 100}%`,
              width: '6px',
              height: '6px',
              background: 'var(--color-amber)',
              borderRadius: '50%',
              top: '-1.5px'
            }}></div>
          </div>
        )}
      </div>

      {/* Volatility */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Average True Range (ATR)</span>
        <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--color-white)' }}>
          ₹{technical?.atr ? technical.atr.toLocaleString('en-IN') : 'N/A'}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Average price swing index</span>
      </div>

      {/* Trading Volumes */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Volume</span>
        <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'var(--color-white)' }}>
          {stockInfo?.volume ? Number(stockInfo.volume).toLocaleString('en-IN') : 'N/A'}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Cumulative shares traded</span>
      </div>

    </div>
  );
};

export default StockQuoteSummary;
