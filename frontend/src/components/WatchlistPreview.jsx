import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListOrdered, ArrowRight } from 'lucide-react';
import { cleanSymbol, cleanName } from '../utils/formatters';

const WatchlistPreview = ({ loadingWatchlist, watchlist }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
          <ListOrdered size={18} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.5px' }}>Watchlist</h3>
        </div>
        
        <button 
          onClick={() => navigate('/watchlist')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>Manage</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {loadingWatchlist ? (
        <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <div className="glow-spinner" style={{ width: '20px', height: '20px' }}></div>
        </div>
      ) : watchlist.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
          {watchlist.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(`/stock/${cleanSymbol(item.symbol)}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--bg-card-40)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-muted-30)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-white)' }}>{cleanSymbol(item.symbol)}</span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{cleanName(item.symbol, item.stock_name)}</p>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>
                View Details
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          gap: '10px',
          border: '1px dashed var(--color-muted-30)',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          margin: 'auto'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Watchlist empty.</span>
          <button onClick={() => navigate('/watchlist')} className="btn" style={{ padding: '6px 12px', fontSize: '11px' }}>
            Add Stocks
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchlistPreview;
