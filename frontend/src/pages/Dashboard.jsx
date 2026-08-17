import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StockCard from '../components/StockCard';
import { Layers } from 'lucide-react';

// Reusable Components
import SearchBox from '../components/SearchBox';
import AiAssistantPrompt from '../components/AiAssistantPrompt';
import NewsWidget from '../components/NewsWidget';
import TopMoversList from '../components/TopMoversList';
import WatchlistPreview from '../components/WatchlistPreview';

// Mock Fallbacks
import { mockIndices, mockMovers, mockSentiment } from '../utils/mockData';

const Dashboard = () => {
  const [indices, setIndices] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [newsData, setNewsData] = useState(null);

  const [loadingIndices, setLoadingIndices] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  useEffect(() => {
    // 1. Fetch Market Indices
    const fetchIndices = async () => {
      try {
        const results = await Promise.all([
          api.post('/api/stocks/info/', { symbol: 'NIFTY' }).catch(() => ({ data: mockIndices[0] })),
          api.post('/api/stocks/info/', { symbol: 'BANKNIFTY' }).catch(() => ({ data: mockIndices[1] })),
          api.post('/api/stocks/info/', { symbol: 'SENSEX' }).catch(() => ({ data: mockIndices[2] }))
        ]);
        setIndices(results.map(r => r.data));
      } catch (err) {
        console.error("Error loading indices:", err);
        setIndices(mockIndices);
      } finally {
        setLoadingIndices(false);
      }
    };

    // 2. Fetch Top Movers
    const fetchTopMovers = async () => {
      try {
        const results = await Promise.all([
          api.post('/api/stocks/info/', { symbol: 'RELIANCE' }).catch(() => ({ data: mockMovers[0] })),
          api.post('/api/stocks/info/', { symbol: 'TCS' }).catch(() => ({ data: mockMovers[1] })),
          api.post('/api/stocks/info/', { symbol: 'INFY' }).catch(() => ({ data: mockMovers[2] })),
          api.post('/api/stocks/info/', { symbol: 'HDFCBANK' }).catch(() => ({ data: mockMovers[3] }))
        ]);
        const mapped = results.map((r, i) => ({
          ...r.data,
          change: r.data.change !== undefined ? r.data.change : mockMovers[i].change,
          changePercent: r.data.changePercent !== undefined ? r.data.changePercent : mockMovers[i].changePercent
        }));
        setTopMovers(mapped);
      } catch (err) {
        console.error("Error loading top movers:", err);
        setTopMovers(mockMovers);
      }
    };

    // 3. Fetch Watchlist Preview
    const fetchWatchlist = async () => {
      try {
        const response = await api.get('/api/watchlist/');
        setWatchlist(response.data.slice(0, 4)); // show top 3 items
      } catch (err) {
        console.error("Error loading watchlist:", err);
      } finally {
        setLoadingWatchlist(false);
      }
    };

    // 4. Fetch Market News
    const fetchNews = async () => {
      try {
        const response = await api.get('/api/stocks/news/');
        setNewsData(response.data);
      } catch (err) {
        console.error("Error loading news:", err);
        const fallbackArticles = mockSentiment.headlines.map((headline, idx) => ({
          title: headline,
          link: 'https://news.google.com',
          published: `Fri, 24 Jul 2026 ${12 - idx}:15:00 GMT`
        }));
        setNewsData({
          headline_count: mockSentiment.headline_count,
          articles: fallbackArticles
        });
      } finally {
        setLoadingNews(false);
      }
    };

    fetchIndices();
    fetchTopMovers();
    fetchWatchlist();
    fetchNews();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

      {/* Search Bar Row */}
      <SearchBox />

      {/* Index Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
          <Layers size={16} color="var(--color-lavender)" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--color-lavender)', letterSpacing: '0.5px' }}>
            Market Indices
          </span>
        </div>

        {loadingIndices ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card" style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glow-spinner" style={{ width: '24px', height: '24px' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {indices.map((idx, index) => (
              <StockCard key={index} stock={idx} isIndex={true} />
            ))}
          </div>
        )}
      </div>

      {/* Mid Split: AI Assistant Launchpad & Recent News */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
      }} className="dashboard-mid-grid">
        <AiAssistantPrompt />
        <NewsWidget loadingNews={loadingNews} newsData={newsData} />
      </div>

      {/* Bottom Grid: Top Movers & Watchlist Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }} className="dashboard-bottom-grid">
        <TopMoversList topMovers={topMovers} />
        <WatchlistPreview loadingWatchlist={loadingWatchlist} watchlist={watchlist} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-mid-grid, .dashboard-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
