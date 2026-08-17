import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cleanSymbol, cleanName } from '../utils/formatters';

const TopMoversList = ({ topMovers }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
        <TrendingUp size={18} />
        <h3 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.5px' }}>Top Movers</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {topMovers.map((mover) => {
          const isUp = mover.change >= 0;
          const cleanSym = cleanSymbol(mover.symbol);
          
          return (
            <div 
              key={mover.symbol} 
              onClick={() => navigate(`/stock/${cleanSym}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
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
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-white)' }}>{cleanSym}</span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{cleanName(mover.symbol, mover.name)}</p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif' }}>
                   ₹{mover.current_price?.toFixed(2)}
                </span>
                <p style={{ 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  color: isUp ? 'var(--color-amber)' : 'var(--color-coral)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '2px'
                }}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {isUp ? '+' : ''}{mover.changePercent?.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMoversList;
