import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StockCard from '../components/StockCard';
import { Layers } from 'lucide-react';

// Reusable Components
import SearchBox from '../components/SearchBox';
import AiAssistantPrompt from '../components/AiAssistantPrompt';
import NewsWidget from '../components/NewsWidget';
import WatchlistPreview from '../components/WatchlistPreview';

// Mock Fallbacks
import { mockIndices, mockSentiment } from '../utils/mockData';

const Dashboard = () => {
  const [indices, setIndices] = useState([]);
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

    // 2. Fetch Watchlist Preview
    const fetchWatchlist = async () => {
      try {
        const response = await api.get('/api/watchlist/');
        setWatchlist(response.data.slice(0, 4)); // show top 4 items
      } catch (err) {
        console.error("Error loading watchlist:", err);
      } finally {
        setLoadingWatchlist(false);
      }
    };

    // 3. Fetch Market News
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

      {/* Watchlist Preview */}
      <WatchlistPreview loadingWatchlist={loadingWatchlist} watchlist={watchlist} />

      <style>{`
        @media (max-width: 900px) {
          .dashboard-mid-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
