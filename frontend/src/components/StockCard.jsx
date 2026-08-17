import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cleanSymbol as cleanSymbolFormatter, cleanName } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Layers } from 'lucide-react';

const StockCard = ({ stock, isIndex = false }) => {
  const navigate = useNavigate();
  const { symbol, name, current_price, day_high, day_low, volume, change, changePercent } = stock;

  const displaySymbol = cleanSymbolFormatter(symbol);
  const displayName = cleanName(symbol, name);

  // Derive positive trend (using yfinance change details if available, otherwise mock/calculate or default)
  // Let's assume a default positive trend or calculate if day_high/day_low/current_price are present.
  // Standard DRF Stock Info returns: symbol, name, current_price, day_high, day_low, volume.
  // Let's calculate a mock change & percentage if they are not directly returned from the API, 
  // since yfinance doesn't always populate change/changePercent in the basic info response.
  const hasChange = change !== undefined;
  const isPositive = hasChange ? change >= 0 : (current_price > (day_high + day_low) / 2);
  const diffVal = hasChange ? change : (current_price - (day_high + day_low) / 2);
  const diffPercent = hasChange ? changePercent : ((diffVal / (current_price || 1)) * 100);

  const formattedPrice = current_price ? Number(current_price).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }) : 'N/A';

  const formattedHigh = day_high ? Number(day_high).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  }) : 'N/A';

  const formattedLow = day_low ? Number(day_low).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  }) : 'N/A';

  const formattedVolume = volume ? Number(volume).toLocaleString('en-IN') : 'N/A';

  const handleClick = () => {
    if (symbol) {
      navigate(`/stock/${displaySymbol}`);
    }
  };

  return (
    <div 
      className={`glass-card ${isPositive ? 'gold-glow' : ''}`}
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Top row: Name & Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{
            fontSize: '12px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            color: 'var(--color-lavender)',
            letterSpacing: '0.5px'
          }}>
            {displaySymbol}
          </span>
          <h3 style={{
            fontSize: '16px',
            color: 'var(--color-white)',
            fontWeight: 700,
            lineHeight: '1.2'
          }}>
            {displayName}
          </h3>
        </div>

        
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: isPositive ? 'var(--color-bullish-10)' : 'var(--color-bearish-10)',
          border: `1px solid ${isPositive ? 'var(--color-bullish-30)' : 'var(--color-bearish-30)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isPositive ? (
            <ArrowUpRight size={18} color="var(--color-amber)" />
          ) : (
            <ArrowDownRight size={18} color="var(--color-coral)" />
          )}
        </div>
      </div>

      {/* Mid row: Price & Trend */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '5px 0' }}>
        <span style={{
          fontSize: '26px',
          fontWeight: 800,
          fontFamily: 'Outfit, sans-serif',
          color: 'var(--color-white)',
          letterSpacing: '-0.5px'
        }}>
          ₹{formattedPrice}
        </span>
        
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'Outfit, sans-serif',
          color: isPositive ? 'var(--color-amber)' : 'var(--color-coral)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          background: isPositive ? 'var(--color-bullish-10)' : 'var(--color-bearish-10)',
          padding: '2px 8px',
          borderRadius: '6px',
          border: `1px solid ${isPositive ? 'var(--color-bullish-20)' : 'var(--color-bearish-20)'}`
        }}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{diffPercent.toFixed(2)}%
        </span>
      </div>

      {/* Bottom row: Info ranges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '12px',
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span>Daily Range</span>
          <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>
            ₹{formattedLow} - ₹{formattedHigh}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-end' }}>
          <span>Volume</span>
          <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>
            {formattedVolume}
          </span>
        </div>
      </div>

      {/* High/Low Visual Bar Indicator */}
      {current_price && day_high && day_low && day_high !== day_low && (
        <div style={{
          height: '3px',
          background: 'var(--bg-dark-60)',
          borderRadius: '2px',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          marginTop: '-5px'
        }}>
          <div style={{
            position: 'absolute',
            left: `${Math.max(0, Math.min(100, ((current_price - day_low) / (day_high - day_low)) * 100))}%`,
            width: '6px',
            height: '6px',
            background: isPositive ? 'var(--color-amber)' : 'var(--color-coral)',
            borderRadius: '50%',
            top: '-1.5px',
            boxShadow: `0 0 5px ${isPositive ? 'var(--color-amber)' : 'var(--color-coral)'}`
          }} />
        </div>
      )}
    </div>
  );
};

export default StockCard;
