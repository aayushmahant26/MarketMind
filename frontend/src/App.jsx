import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import StockDetail from './pages/StockDetail';
import NewsPage from './pages/NewsPage';
import AnalysisPage from './pages/AnalysisPage';
import ChatPage from './pages/ChatPage';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Layout wrapper for all protected pages
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper to map current route path to a formatted page heading
  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/watchlist') return 'Watchlist';
    if (pathname.startsWith('/stock/')) {
      const parts = pathname.split('/');
      const symbol = parts[parts.length - 1] || 'RELIANCE';
      return `Stock Details - ${symbol.toUpperCase()}`;
    }
    if (pathname === '/news') return 'Market News';
    if (pathname === '/analyze') return 'AI Research';
    if (pathname === '/chat') return 'AI Assistant';
    return 'MarketMind';
  };


  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Top Fixed Header */}
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        pageTitle={getPageTitle(location.pathname)} 
      />
      
      {/* Collapsible Left Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Scrollable Work Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Interfaces */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Secured Trading Spaces */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/stock/:symbol" element={<StockDetail />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/analyze" element={<AnalysisPage />} />
                <Route path="/chat" element={<ChatPage />} />
              </Route>
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
