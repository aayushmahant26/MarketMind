import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { cleanSymbol as cleanSymbolFormatter, cleanName } from '../utils/formatters';
import { Trash2, BrainCircuit, TrendingUp, TrendingDown, Eye, AlertCircle } from 'lucide-react';

const WatchlistCard = ({ item, onRemove }) => {
  const navigate = useNavigate();
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const displaySymbol = cleanSymbolFormatter(item.symbol);
  const displayName = cleanName(item.symbol, item.stock_name);

  // Lazy-Loading . Instead of fetching data of all stock in watchlist at once , we fetch one stock data , then display that stock , the fetch next , display next ...
  // because of this , page doesnt get stuck until data of all stocks are fetched . 
  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const response = await api.post('/api/stocks/info/', { symbol: item.symbol });
        setStockInfo(response.data);
        setError(false);
      } catch (err) {
        console.error(`Error loading info for ${item.symbol}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStockInfo();
  }, [item.symbol]);

  const handleQuickAnalyze = () => {
    // Navigate to analyze page and pass the symbol as state
    navigate('/analyze', { state: { prefilledSymbol: displaySymbol } });
  };

  const handleViewDetail = () => {
    navigate(`/stock/${displaySymbol}`);
  };

  // Derive trends
  const price = stockInfo?.current_price;
  const high = stockInfo?.day_high;
  const low = stockInfo?.day_low;
  const change = stockInfo?.change;
  const changePercent = stockInfo?.changePercent;
  const hasChange = change !== undefined && changePercent !== undefined;

  const isPositive = hasChange ? change >= 0 : (price && high && low ? price > (high + low) / 2 : true);
  const displayChangePercent = hasChange ? changePercent : (price && high && low ? ((price - (high + low) / 2) / price) * 100 : 0.45);


  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        borderLeft: `4px solid ${error ? 'var(--color-coral)' : (isPositive ? 'var(--color-amber)' : 'var(--color-coral)')}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
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
            fontSize: '18px',
            color: 'var(--color-white)',
            fontWeight: 700,
            margin: '2px 0 4px 0'
          }}>
            {displayName}
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            Added on {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleViewDetail}
            title="View Details"
            style={{
              background: 'var(--color-muted-10)',
              border: '1px solid var(--color-muted-30)',
              color: 'var(--color-white)',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-white)';
              e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-muted-30)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Eye size={14} />
          </button>

          <button
            onClick={() => onRemove(item.id)}
            title="Delete Watchlist Item"
            style={{
              background: 'var(--color-bearish-10)',
              border: '1px solid var(--color-bearish-30)',
              color: 'var(--color-coral)',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-coral)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 10px var(--color-bearish-20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bearish-10)';
              e.currentTarget.style.color = 'var(--color-coral)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Live price subpanel */}
      <div style={{
        background: 'var(--bg-card-40)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '50px'
      }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="glow-spinner" style={{ width: '14px', height: '14px', borderWidth: '1.5px' }}></div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>Fetching live price...</span>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-coral)' }}>
            <AlertCircle size={14} />
            <span style={{ fontSize: '11px' }}>Feed offline</span>
          </div>
        ) : (
          <>
            <div>
              <span style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-white)',
                fontFamily: 'Outfit, sans-serif'
              }}>
                ₹{price ? price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : 'N/A'}
              </span>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isPositive ? 'var(--color-amber)' : 'var(--color-coral)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              background: isPositive ? 'var(--color-bullish-10)' : 'var(--color-bearish-10)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${isPositive ? 'var(--color-bullish-20)' : 'var(--color-bearish-20)'}`
            }}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPositive ? '+' : ''}{displayChangePercent.toFixed(2)}%
            </span>
          </>
        )}
      </div>

      {/* Quick Analyze CTA */}
      <button
        onClick={handleQuickAnalyze}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '12px',
          letterSpacing: '1px'
        }}
      >
        <BrainCircuit size={14} />
        <span>Launch AI Analysis</span>
      </button>
    </div>
  );
};

export default WatchlistCard;
