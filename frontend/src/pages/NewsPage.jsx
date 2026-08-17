import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Search,
  ExternalLink,
  RefreshCw,
  Newspaper,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { mockSentiment } from '../utils/mockData';

const NewsPage = () => {
  const [query, setQuery] = useState('NIFTY');
  const [searchVal, setSearchVal] = useState('NIFTY');
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  // Quick select topics
  const quickTags = [
    { label: 'NIFTY Index', query: 'NIFTY' },
    { label: 'Bank Nifty', query: 'BANKNIFTY' },
    { label: 'Reliance', query: 'RELIANCE' },
    { label: 'TCS', query: 'TCS' },
    { label: 'Infosys', query: 'INFY' },
    { label: 'Interest Rates', query: 'RBI interest rate' },
    { label: 'Global Markets', query: 'NASDAQ inflation' }
  ];

  const fetchNews = async (searchQuery) => {
    setLoading(true);
    setErrorMsg('');
    setIsFallback(false);
    try {
      const response = await api.get(`/api/stocks/news/?q=${encodeURIComponent(searchQuery)}`);
      setNewsData(response.data);
    } catch (err) {
      console.error('Error fetching market news:', err);
      setErrorMsg('Failed to fetch real-time news. Displaying historical mock news fallback.');
      setIsFallback(true);

      // Create detailed fallback articles from mockSentiment with simulated dates
      const fallbackArticles = mockSentiment.headlines.map((headline, idx) => ({
        title: headline,
        link: 'https://news.google.com/search?q=' + encodeURIComponent(searchQuery),
        published: `Fri, 24 Jul 2026 ${12 - idx}:15:00 GMT`
      }));

      setNewsData({
        headline_count: mockSentiment.headline_count,
        articles: fallbackArticles
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(query);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setQuery(searchVal.trim());
    }
  };

  const handleTagClick = (tagQuery) => {
    setSearchVal(tagQuery);
    setQuery(tagQuery);
  };

  // Format RSS date string to something shorter and cleaner (e.g. "Fri, 24 Jul - 12:15 PM")
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // fallback if parsing fails

      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

      {/* Fallback Warning Banner */}
      {isFallback && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '8px',
          color: 'var(--color-coral)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px'
        }}>
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Input Row */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <Search
              size={18}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Search news by ticker or keyword (e.g. RELIANCE, Nifty, Inflation...)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{ paddingLeft: '48px', height: '48px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 24px' }}>
            Search News
          </button>
        </form>

        {/* Quick select tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            marginRight: '8px'
          }}>
            Quick Filters:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag.query)}
              style={{
                background: query === tag.query ? 'var(--color-primary-20)' : 'var(--bg-dark-60)',
                border: query === tag.query ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                color: query === tag.query ? 'var(--color-white)' : 'var(--color-lavender)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (query !== tag.query) {
                  e.currentTarget.style.borderColor = 'var(--color-lavender)';
                  e.currentTarget.style.color = 'var(--color-white)';
                }
              }}
              onMouseLeave={(e) => {
                if (query !== tag.query) {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.color = 'var(--color-lavender)';
                }
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-container">
            <div className="glow-spinner"></div>
            <p style={{ marginTop: '20px', color: 'var(--color-lavender)', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>
              Fetching latest headlines for "{query}"...
            </p>
          </div>
        </div>
      ) : (
        /* Full Width Headlines Feed */
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Newspaper size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '18px', color: 'var(--color-white)' }}>
                Live Feed for "{query}" ({newsData?.headline_count || 0} articles)
              </h3>
            </div>
            <button
              onClick={() => fetchNews(query)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-lavender)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-white)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lavender)'}
            >
              <RefreshCw size={14} />
              Refresh Feed
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: '650px',
            overflowY: 'auto',
            paddingRight: '6px'
          }} className="custom-scroll">
            {newsData?.articles && newsData.articles.length > 0 ? (
              newsData.articles.map((article, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '18px 24px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'transform 0.2s, background 0.2s'
                  }}
                  className="article-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'flex-start' }}>
                    <h4 style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--color-white)',
                      lineHeight: '1.4',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {article.title}
                    </h4>

                    <a
                      href={article.link}
                      target="_blank" // Opens the link in a new browser tab, keeping our application open.
                      rel="noopener noreferrer" // Prevents the new page from accessing the window object of our app (window.opener), protecting the client session from malicious scripts.
                      style={{
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s',
                        padding: '4px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                      title="Open article in Google News"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                    paddingTop: '10px',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-lavender)' }}>
                      <Calendar size={14} color="var(--color-primary)" />
                      <span>{formatDate(article.published)}</span>
                    </div>

                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Google News RSS
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--color-lavender)',
                fontFamily: 'Inter, sans-serif'
              }}>
                No articles found for "{query}". Try searching another keyword.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive design and hover states */}
      <style>{`
        .article-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(148, 163, 184, 0.2) !important;
        }

        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: var(--color-muted-20);
          border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary-20);
        }
      `}</style>
    </div>
  );
};

export default NewsPage;
