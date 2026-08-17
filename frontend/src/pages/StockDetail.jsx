import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { cleanSymbol } from '../utils/formatters';
import ChartComponent from '../components/ChartComponent';
import { Calendar } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

// Reusable Components
import SearchBox from '../components/SearchBox';
import StockDetailHeader from '../components/StockDetailHeader';
import StockQuoteSummary from '../components/StockQuoteSummary';
import TechnicalAnalysisWidget from '../components/TechnicalAnalysisWidget';

// Mock Fallbacks
import { getMockInfo, generateMockHistory, mockTechnical } from '../utils/mockData';

const StockDetail = () => {
  const { theme } = useContext(ThemeContext);
  const { symbol } = useParams();
  const navigate = useNavigate();
  const activeSymbol = symbol ? symbol.toUpperCase() : 'RELIANCE';

  const [stockInfo, setStockInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [technical, setTechnical] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [watchlistStatus, setWatchlistStatus] = useState('idle'); // idle, adding, added

  // Normalized query symbol for API payloads
  const getQuerySymbol = (sym) => {
    const uppercase = sym.toUpperCase();
    if (uppercase === 'NIFTY' || uppercase === 'NSEI') return '^NSEI';
    if (uppercase === 'BANKNIFTY' || uppercase === 'NSEBANK') return '^NSEBANK';
    if (uppercase === 'SENSEX' || uppercase === 'BSESN') return '^BSESN';
    return uppercase;
  };

  const querySymbol = getQuerySymbol(activeSymbol);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockInfo = getMockInfo(activeSymbol, querySymbol);
      // Execute three API endpoints in parallel
      // We have used .catch for every individual API call seperately . This is because if a single promise inside Promise.all fails, the entire statement crashes 
      // By appending a .catch() to each sub-promise, we intercept individual failures. If the Technical Indicators calculation fails (perhaps the backend's indicator module is down), we fallback to mock details for that indicator only, while the historical chart and live quote summary still load successfully.
      const [infoRes, historyRes, techRes] = await Promise.all([
        api.post('/api/stocks/info/', { symbol: querySymbol }).catch(err => {
          console.warn("Failed fetching info, falling back", err);
          return { data: mockInfo };
        }),
        api.post('/api/stocks/history/', { symbol: querySymbol }).catch(err => {
          console.warn("Failed fetching history, falling back", err);
          return { data: generateMockHistory() };
        }),
        api.post('/api/stocks/technical/', { symbol: querySymbol }).catch(err => {
          console.warn("Failed fetching technical analysis, falling back", err);
          return { data: mockTechnical };
        })
      ]);

      setStockInfo(infoRes.data);
      setHistory(historyRes.data);
      setTechnical(techRes.data);
    } catch (err) {
      console.error("Failed to load details for stock:", err);
      setError("Failed to load indicators. Try checking local Django endpoints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setWatchlistStatus('idle');
  }, [symbol]);

  const handleAddToWatchlist = async () => {
    setWatchlistStatus('adding');
    try {
      await api.post('/api/watchlist/add/', { symbol: querySymbol });
      setWatchlistStatus('added');
      setTimeout(() => setWatchlistStatus('idle'), 3000);
    } catch (err) {
      console.error("Watchlist add error:", err);
      setWatchlistStatus('idle');
      alert("Failed to add to watchlist. Verify authentication.");
    }
  };

  const handleQuickAnalyze = () => {
    navigate('/analyze', { state: { prefilledSymbol: cleanSymbol(querySymbol) } });
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '400px' }}>
        <div className="glow-spinner"></div>
        <p style={{ marginTop: '15px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontSize: '14px' }}>
          Loading details for {cleanSymbol(querySymbol)}...
        </p>
      </div>
    );
  }

  // Calculate pricing dynamics
  const price = stockInfo?.current_price;
  const high = stockInfo?.day_high;
  const low = stockInfo?.day_low;
  const change = stockInfo?.change;
  const changePercent = stockInfo?.changePercent;
  const hasChange = change !== undefined && changePercent !== undefined;

  const isPositiveTrend = hasChange ? change >= 0 : (technical?.trend === 'Bullish' || (price > (high + low) / 2));
  const percentChange = hasChange ? changePercent : (price && high && low ? ((price - (high + low) / 2) / price) * 100 : 0.85);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

      {/* Search Bar Row */}
      <SearchBox />

      {/* Header Container */}
      <StockDetailHeader
        isPositiveTrend={isPositiveTrend}
        technical={technical}
        querySymbol={querySymbol}
        stockInfo={stockInfo}
        activeSymbol={activeSymbol}
        watchlistStatus={watchlistStatus}
        handleAddToWatchlist={handleAddToWatchlist}
        handleQuickAnalyze={handleQuickAnalyze}
      />

      {/* Quote summary panel */}
      <StockQuoteSummary
        price={price}
        isPositiveTrend={isPositiveTrend}
        percentChange={percentChange}
        low={low}
        high={high}
        technical={technical}
        stockInfo={stockInfo}
      />

      {/* Mid Splitting: Chart vs Technical Gauges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }} className="stock-detail-mid-grid">

        {/* Left Side: Historical Line Chart */}
        <div className="glass-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '16px', letterSpacing: '0.5px', fontWeight: 600, color: 'var(--color-white)' }}>Historical Chart</h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>
              Interval: 1 Day
            </span>
          </div>

          <ChartComponent historyData={history} symbol={cleanSymbol(querySymbol)} isLight={theme === 'light'} />
        </div>

        {/* Right Side: Technical Indicator Dashboard */}
        <TechnicalAnalysisWidget technical={technical} />

      </div>

      <style>{`
        @media (max-width: 900px) {
          .stock-detail-mid-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StockDetail;
