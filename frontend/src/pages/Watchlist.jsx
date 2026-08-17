import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import WatchlistCard from '../components/WatchlistCard';
import { ListPlus, Search, ShieldAlert, BookOpen } from 'lucide-react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newSymbol, setNewSymbol] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Fetch search results based on user input.
  // Use debouncing to avoid too many requests.
  useEffect(() => {
    if (!newSymbol.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await api.get(`/api/stocks/search/?q=${newSymbol}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce); // cleanup function to stop the previous timer 
  }, [newSymbol]);

  // Fetch all watchlist items
  const fetchWatchlist = async () => {
    try {
      const response = await api.get('/api/watchlist/');
      setWatchlist(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      setError("Failed to load watchlist. Verify Django server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Handle adding a stock to the watchlist
  const handleAddStock = async (e) => {
    e.preventDefault();
    setAddError(null);
    const trimmedSymbol = newSymbol.trim().toUpperCase();

    if (!trimmedSymbol) {
      setAddError("Symbol is required.");
      return;
    }

    setAdding(true);
    try {
      // POST payload: { symbol: 'RELIANCE' }
      const response = await api.post('/api/watchlist/add/', { symbol: trimmedSymbol });

      // Clear input
      setNewSymbol('');

      // Reload watchlist items
      await fetchWatchlist();
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
      const errMsg = err.response?.data?.error || "Error adding stock. Verify symbol exists.";
      setAddError(errMsg);
    } finally {
      setAdding(false);
    }
  };

  // Handle deleting a stock from the watchlist
  const handleRemoveStock = async (itemId) => {
    try {
      // DELETE URL: /api/watchlist/delete/<item_id>/
      await api.delete(`/api/watchlist/delete/${itemId}/`);

      // Instantly update state locally for smooth UX
      setWatchlist(watchlist.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Failed to delete watchlist item:", err);
      setError("Failed to delete item from watchlist.");
    }
  };

  const popularSuggestions = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

      {/* Top section: Title and Quick Add Form */}
      <div className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        overflow: 'visible',
        zIndex: 10
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '5px' }}>
            Watchlist
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Monitor and manage your favorite stocks.
          </p>
        </div>

        {/* Add Stock Inline Form */}
        <form onSubmit={handleAddStock} style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => {
                setNewSymbol(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="e.g. RELIANCE..."
              disabled={adding}
              className="input-field"
              style={{
                width: '200px',
                paddingRight: '35px',
                textTransform: 'uppercase'
              }}
            />
            <Search size={14} color="var(--color-lavender)" style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />

            {/* Suggestions Dropdown */}
            {showSearchDropdown && newSymbol.trim() !== '' && searchResults.length > 0 && (
              <>
                <div
                  onClick={() => setShowSearchDropdown(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 998
                  }}
                />
                <div className="glass-card animate-fade-in" style={{
                  position: 'absolute',
                  top: '50px',
                  left: 0,
                  width: '250px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 999,
                  padding: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--bg-plum)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      onClick={() => {
                        setNewSymbol(result.symbol);
                        setShowSearchDropdown(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.2s',
                        fontSize: '13px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-10)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontWeight: 'bold', color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif' }}>
                        {result.symbol}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                        {result.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={adding}
            style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ListPlus size={16} />
            <span>{adding ? 'Adding...' : 'Add'}</span>
          </button>
        </form>
      </div>

      {/* Add stock validation error */}
      {addError && (
        <div style={{
          background: 'var(--color-bearish-10)',
          border: '1px solid var(--color-coral)',
          color: 'var(--color-coral)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <ShieldAlert size={18} />
          <span>{addError}</span>
        </div>
      )}

      {/* Main Watchlist Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="glow-spinner"></div>
          <p style={{ marginTop: '15px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontSize: '14px' }}>
            Loading watchlist...
          </p>
        </div>
      ) : error ? (
        <div style={{
          background: 'var(--color-bearish-10)',
          border: '1px solid var(--color-coral)',
          color: 'var(--color-coral)',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <ShieldAlert size={36} style={{ marginBottom: '10px' }} />
          <h3>{error}</h3>
        </div>
      ) : watchlist.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {watchlist.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onRemove={handleRemoveStock}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          textAlign: 'center',
          border: '1px dashed var(--glass-border)',
          borderRadius: '16px',
          gap: '20px'
        }}>
          <BookOpen size={48} color="var(--color-lavender)" />
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Your Watchlist is Empty</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', maxWidth: '400px' }}>
              Add tickers here to scan live quotes, analyze technical patterns, and generate AI research reports instantly.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: 'var(--color-lavender)' }}>
              Popular Stocks:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {popularSuggestions.map(sym => (
                <button
                  key={sym}
                  onClick={() => setNewSymbol(sym)}
                  style={{
                    background: 'var(--color-muted-10)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-white)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'Outfit, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Watchlist;
