import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, BookOpen, X } from 'lucide-react';

const SearchBox = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Browse All Directory States
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(100);
  const [loadingStocks, setLoadingStocks] = useState(false);

  // Autocomplete search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await api.get(`/api/stocks/search/?q=${searchQuery}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Browse all directory modal handlers
  const handleOpenBrowseModal = async () => {
    setIsModalOpen(true);
    setModalSearch('');
    setVisibleCount(100);
    
    if (allStocks.length === 0) {
      setLoadingStocks(true);
      try {
        const response = await api.get('/api/stocks/all/');
        setAllStocks(response.data);
        setFilteredStocks(response.data);
      } catch (err) {
        console.error("Failed to fetch all stocks directory:", err);
      } finally {
        setLoadingStocks(false);
      }
    } else {
      setFilteredStocks(allStocks);
    }
  };

  useEffect(() => {
    if (!modalSearch.trim()) {
      setFilteredStocks(allStocks);
    } else {
      const query = modalSearch.toLowerCase();
      const filtered = allStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query) || 
        stock.name.toLowerCase().includes(query)
      );
      setFilteredStocks(filtered);
    }
    setVisibleCount(100);
  }, [modalSearch, allStocks]);

  const handleSelectStock = (symbol) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/stock/${symbol}`);
  };

  return (
    <>
      <div className="glass-card" style={{ padding: '20px', position: 'relative', zIndex: 100, overflow: 'visible' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
          <label style={{ fontSize: '12px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
            SEARCH STOCKS
          </label>
          <div style={{ display: 'flex', position: 'relative', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', position: 'relative', alignItems: 'center', flexGrow: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search symbol or company name (e.g. Reliance, TCS, Nifty)..."
                className="input-field"
                style={{
                  width: '100%',
                  paddingLeft: '45px',
                  paddingRight: '15px',
                  height: '45px',
                  background: 'var(--bg-dark-80)'
                }}
              />
              <Search size={18} color="var(--color-lavender)" style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
            </div>
            <button
              onClick={handleOpenBrowseModal}
              type="button"
              className="btn"
              style={{
                height: '45px',
                padding: '0 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                fontSize: '13px'
              }}
            >
              <BookOpen size={16} />
              <span>Browse All</span>
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {showSearchDropdown && searchQuery.trim() !== '' && searchResults.length > 0 && (
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
                top: '75px',
                left: 0,
                right: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 999,
                padding: '10px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-plum)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {searchResults.map((result) => (
                  <div
                    key={result.symbol}
                    onClick={() => handleSelectStock(result.symbol)}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.2s'
                    }}
                    className="search-item-hover"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-10)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontWeight: 'bold', color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif' }}>
                      {result.symbol}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                      {result.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Browse Stocks Directory Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            padding: '24px',
            border: '1px solid var(--glass-border)',
            background: 'var(--bg-plum)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                <BookOpen size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-white)' }}>Stocks Directory</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '5px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-white)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search Box */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Search symbol or name..."
                className="input-field"
                style={{ paddingLeft: '40px', background: 'var(--bg-dark-60)' }}
              />
              <Search size={16} color="var(--color-lavender)" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Modal List Area */}
            {loadingStocks ? (
              <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '10px' }}>
                <div className="glow-spinner"></div>
                <span style={{ fontSize: '13px', color: 'var(--color-lavender)' }}>Loading directory...</span>
              </div>
            ) : filteredStocks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  overflowY: 'auto', 
                  flexGrow: 1, 
                  paddingRight: '5px' 
                }}>
                  {filteredStocks.slice(0, visibleCount).map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => {
                        setIsModalOpen(false);
                        navigate(`/stock/${stock.symbol}`);
                      }}
                      className="search-item-hover"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--bg-card-40)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    >
                      <span style={{ fontWeight: 'bold', color: 'var(--color-white)', fontFamily: 'Outfit, sans-serif' }}>
                        {stock.symbol}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                        {stock.name}
                      </span>
                    </div>
                  ))}
                  
                  {/* Load More Button */}
                  {visibleCount < filteredStocks.length && (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 100)}
                      className="btn"
                      style={{
                        marginTop: '10px',
                        padding: '10px',
                        fontSize: '12px',
                        width: '100%',
                        background: 'var(--bg-card-60)'
                      }}
                    >
                      Load More ({filteredStocks.length - visibleCount} remaining)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No matching stocks found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBox;
