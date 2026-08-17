import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import ReportCard from '../components/ReportCard';
import { cleanSymbol } from '../utils/formatters';
import { BrainCircuit, Send, ListRestart, History, AlertTriangle, Cpu, Terminal, Trash2 } from 'lucide-react';

const AnalysisPage = () => {
  const location = useLocation();
  const [searchVal, setSearchVal] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Load report history on mount
  const fetchReportHistory = async () => {
    try {
      const response = await api.get('/api/reports/');
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to load historical reports:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Autocomplete search debounce
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await api.get(`/api/stocks/search/?q=${searchVal}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  useEffect(() => {
    fetchReportHistory();

    // Check if query or symbol was prefilled from another page
    if (location.state?.prefilledQuery) {
      const queryText = location.state.prefilledQuery;
      const match = queryText.match(/Analyze\s+([A-Za-z0-9^_-]+)/i);
      const sym = match ? match[1] : queryText;
      setSearchVal(sym);
      setSelectedSymbol(sym);
      triggerAnalysis(queryText);
    } else if (location.state?.prefilledSymbol) {
      const prefilledSymbol = location.state.prefilledSymbol.replace('^', '');
      setSearchVal(prefilledSymbol);
      setSelectedSymbol(prefilledSymbol);
      triggerAnalysis(`Analyze ${prefilledSymbol}`);
    }
  }, [location.state]);

  const triggerAnalysis = async (queryText) => {
    if (!queryText.trim()) return;
    setRunningAnalysis(true);
    setAnalysisError(null);
    setActiveReport(null);

    try {
      // POST: { query: 'Analyze NIFTY for tomorrow' }
      // Returns: { report_id, symbol, report }
      const response = await api.post('/api/analyze/', { query: queryText });
      
      const newReport = {
        id: response.data.report_id,
        symbol: response.data.symbol,
        report: response.data.report,
        query: queryText,
        created_at: new Date().toISOString()
      };

      setActiveReport(newReport);
      
      // Reload history logs to display this new report
      await fetchReportHistory();
    } catch (err) {
      console.error("Analysis execution error:", err);
      setAnalysisError(
        err.response?.data?.error || 
        "Django Agent Nodes timed out or encountered an LLM context error."
      );
    } finally {
      setRunningAnalysis(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetSymbol = selectedSymbol || searchVal.trim().toUpperCase();
    if (targetSymbol) {
      triggerAnalysis(`Analyze ${targetSymbol}`);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setActiveReport({
      id: item.id,
      symbol: item.symbol,
      report: item.report,
      query: item.query,
      created_at: item.created_at
    });
  };

  const handleDeleteHistoryItem = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report from your history?")) {
      return;
    }
    try {
      await api.delete(`/api/reports/delete/${reportId}/`);
      
      // Update state locally
      setHistory(prevHistory => prevHistory.filter(item => item.id !== reportId));
      
      // Clear active report if it was the one deleted
      if (activeReport?.id === reportId) {
        setActiveReport(null);
      }
    } catch (err) {
      console.error("Failed to delete report history:", err);
      alert(err.response?.data?.error || "Error deleting report history. Please try again.");
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2.5fr 1fr',
      gap: '30px'
    }} className="analysis-layout-grid animate-fade-in">
      
      {/* Left Workspace: Main Prompt Form & Active Report display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Prompt Card */}
        <div className="glass-card" style={{ overflow: 'visible', zIndex: 50, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)', marginBottom: '15px' }}>
            <BrainCircuit size={22} />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>AI Research</h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative', overflow: 'visible' }}>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Enter stock name or symbol (e.g. Reliance, TCS, Nifty)..."
                className="input-field"
                disabled={runningAnalysis}
                required
                style={{ textTransform: 'uppercase' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif' }}>
                Tip: Select a stock from the suggestions to generate a comprehensive AI report.
              </span>

              {/* Autocomplete Dropdown List */}
              {showSearchDropdown && searchVal.trim() !== '' && searchResults.length > 0 && (
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
                    right: 0,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 999,
                    padding: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--bg-plum)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {searchResults.map((result) => (
                      <div
                        key={result.symbol}
                        onClick={() => {
                          setSearchVal(result.symbol);
                          setSelectedSymbol(result.symbol);
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
              disabled={runningAnalysis || !searchVal.trim()}
              style={{ padding: '12px 24px', flexShrink: 0 }}
            >
              {runningAnalysis ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="glow-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} />
                  <span>Analyze</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Loading details screen */}
        {runningAnalysis && (
          <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div className="glow-spinner" style={{ width: '45px', height: '45px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Generating Analysis Report</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px', maxWidth: '400px' }}>
                Our AI agents are analyzing technical indicators, news sentiment, and risk levels...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {analysisError && (
          <div style={{
            background: 'var(--color-bearish-10)',
            border: '1px solid var(--color-coral)',
            color: 'var(--color-coral)',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={32} />
            <h4 style={{ fontWeight: 600 }}>Analysis Failed</h4>
            <p style={{ fontSize: '13px' }}>{analysisError}</p>
            <button onClick={() => triggerAnalysis(`Analyze ${selectedSymbol || searchVal.trim().toUpperCase()}`)} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '12px', marginTop: '5px' }}>
              <ListRestart size={12} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Active report displays */}
        {activeReport && (
          <ReportCard
            reportText={activeReport.report}
            query={activeReport.query}
            symbol={activeReport.symbol}
            date={activeReport.created_at}
          />
        )}

        {!activeReport && !runningAnalysis && !analysisError && (
          <div className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            border: '1px dashed var(--glass-border)',
            borderRadius: '16px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            gap: '15px'
          }}>
            <Cpu size={40} color="var(--color-lavender)" />
            <div>
              <h3 style={{ color: 'var(--color-white)', fontSize: '18px', fontWeight: 600 }}>AI Stock Analysis</h3>
              <p style={{ fontSize: '13px', maxWidth: '350px', marginTop: '6px' }}>
                Submit a query above or choose an existing report from history to get started.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Right Sidebar: Historical Logs */}
      <div className="glass-card" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px 16px',
        maxHeight: '750px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-lavender)',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '15px'
        }}>
          <History size={18} />
          <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>Report History</h3>
        </div>

        {loadingHistory ? (
          <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <div className="glow-spinner" style={{ width: '20px', height: '20px' }}></div>
          </div>
        ) : history.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowY: 'auto',
            flexGrow: 1,
            paddingRight: '4px'
          }} className="report-history-scroll">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectHistoryItem(item)}
                style={{
                  padding: '12px',
                  background: activeReport?.id === item.id ? 'var(--color-primary-10)' : 'var(--bg-card-40)',
                  border: `1px solid ${activeReport?.id === item.id ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activeReport?.id !== item.id) {
                    e.currentTarget.style.borderColor = 'var(--color-muted-30)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeReport?.id !== item.id) {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-white)' }}>{cleanSymbol(item.symbol)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistoryItem(item.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-coral)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                      title="Delete Report"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {item.query}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            color: 'var(--color-text-muted)',
            fontSize: '12px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            No reports found
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analysis-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisPage;
