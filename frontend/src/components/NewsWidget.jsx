import React from 'react';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';

const NewsWidget = ({ loadingNews, newsData }) => {
  // Format Date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
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

  const articles = newsData?.articles || [];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', minHeight: '260px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-lavender)' }}>
        <Newspaper size={18} color="var(--color-primary)" />
        <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>Latest Headlines</h3>
      </div>

      {loadingNews ? (
        <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <div className="glow-spinner" style={{ width: '20px', height: '20px' }}></div>
        </div>
      ) : articles.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
          {articles.slice(0, 3).map((article, idx) => (
            <div 
              key={idx} 
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              className="widget-article-item"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-white)',
                    fontWeight: 500,
                    lineHeight: '1.4',
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  className="widget-article-link"
                >
                  {article.title}
                </a>
                <ExternalLink size={12} color="var(--color-text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                <Calendar size={10} />
                <span>{formatDate(article.published)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', margin: 'auto' }}>
          No News Available
        </div>
      )}
      
      <style>{`
        .widget-article-item:hover {
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(148, 163, 184, 0.18) !important;
        }
        .widget-article-link:hover {
          color: var(--color-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default NewsWidget;
