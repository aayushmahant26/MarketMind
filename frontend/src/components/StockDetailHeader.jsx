import React from 'react';
import { Check, Plus, Activity } from 'lucide-react';
import { cleanSymbol, cleanName } from '../utils/formatters';

const StockDetailHeader = ({
  isPositiveTrend,
  technical,
  querySymbol,
  stockInfo,
  activeSymbol,
  watchlistStatus,
  handleAddToWatchlist,
  handleQuickAnalyze
}) => {
  return (
    <div className="glass-card" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '24px 30px'
    }}>
      {/* Name and Ticker details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={`badge ${isPositiveTrend ? 'badge-bullish' : 'badge-bearish'}`} style={{ fontSize: '11px' }}>
            {technical?.trend || 'ACTIVE'}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>
            Symbol: {cleanSymbol(querySymbol)}
          </span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 800 }}>
          {cleanName(querySymbol, stockInfo?.name || activeSymbol)}
        </h2>
      </div>

      {/* Action button bar */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleAddToWatchlist}
          disabled={watchlistStatus !== 'idle'}
          className="btn"
          style={{
            borderColor: watchlistStatus === 'added' ? 'var(--color-primary)' : 'var(--color-lavender)',
            background: watchlistStatus === 'added' ? 'var(--color-primary-10)' : 'var(--bg-card-40)',
            color: 'var(--color-white)',
            padding: '10px 16px',
            fontSize: '12px'
          }}
        >
          {watchlistStatus === 'adding' ? (
            <span className="glow-spinner" style={{ width: '12px', height: '12px', borderWidth: '1px' }}></span>
          ) : watchlistStatus === 'added' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} />
              <span>Saved</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} />
              <span>Watchlist</span>
            </div>
          )}
        </button>

        <button
          onClick={handleQuickAnalyze}
          className="btn btn-primary"
          style={{ padding: '10px 16px', fontSize: '12px' }}
        >
          <Activity size={14} />
          <span>Run AI Report</span>
        </button>
      </div>
    </div>
  );
};

export default StockDetailHeader;
