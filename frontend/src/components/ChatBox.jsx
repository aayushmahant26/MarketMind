import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Send, Bot, User, Trash2, Globe, Sparkles, Terminal } from 'lucide-react';
import { cleanSymbol } from '../utils/formatters';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('marketmind_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    } else {
      // Default welcome message
      setMessages([
        {
          role: 'assistant',
          content: "Welcome to MarketMind AI. I am your financial research assistant. Ask me anything about Indian markets, stocks, or technical indicators.",
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Save chat history to localStorage
  const saveHistory = (newMessages) => {
    localStorage.setItem('marketmind_chat_history', JSON.stringify(newMessages));
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/chat/', {
        message: userMessage.content,
        symbol: null
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response || 'No response received from assistant.',
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = err.response?.data?.error || "Connection error. Failed to reach chat agent.";
      setError(errMsg);
      
      const errorMessage = {
        role: 'assistant',
        content: `⚠️ ERROR: ${errMsg}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    const defaultMsg = [
      {
        role: 'assistant',
        content: "Chat reset. Ask me anything about Indian markets, stocks, or technical indicators.",
        timestamp: new Date().toISOString(),
        symbol: ''
      }
    ];
    setMessages(defaultMsg);
    localStorage.removeItem('marketmind_chat_history');
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      padding: '0',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--glass-border)',
        background: 'var(--bg-card-40)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--color-primary-10)',
            border: '1px solid var(--color-primary-20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', color: 'var(--color-white)' }}>MarketMind AI Stock Assistant</h3>
            <span style={{ fontSize: '11px', color: 'var(--color-lavender)', fontFamily: 'Outfit, sans-serif' }}>
              AI Assistant
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={clearHistory}
            title="Reset Terminal"
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bearish-10)';
              e.currentTarget.style.color = 'var(--color-coral)';
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Message List area */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'var(--bg-dark-60)'
      }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          
          return (
            <div 
              key={index} 
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              {!isUser && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--bg-wine) 0%, var(--color-primary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '4px',
                  flexShrink: 0
                }}>
                  <Bot size={12} color="#FFF" />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '75%' }}>
                {/* Bubble */}
                <div style={{
                  background: isUser ? 'var(--color-primary-10)' : 'var(--bg-wine)',
                  border: `1px solid ${isUser ? 'var(--color-primary-20)' : 'var(--glass-border)'}`,
                  color: msg.isError ? 'var(--color-coral)' : 'var(--color-white)',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 2px 16px 16px' : '2px 16px 16px 16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content ? msg.content.replace(/\*\*/g, '') : ''}
                </div>
                
                {/* Info tag */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: isUser ? 'flex-end' : 'flex-start', 
                  alignItems: 'center',
                  gap: '6px', 
                  fontSize: '10px', 
                  color: 'var(--color-text-muted)',
                  fontFamily: 'Outfit, sans-serif',
                  padding: '0 4px'
                }}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {isUser && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--bg-wine) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '4px',
                  flexShrink: 0
                }}>
                  <User size={12} color="#ffffff" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--bg-wine) 0%, var(--color-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '4px',
              flexShrink: 0
                }}>
              <Bot size={12} color="#FFF" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '75%' }}>
              <div style={{
                background: 'var(--bg-wine)',
                border: '1px solid var(--glass-border)',
                padding: '16px 20px',
                borderRadius: '2px 16px 16px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }}></div>
                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-primary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }}></div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'Outfit, sans-serif', padding: '0 4px' }}>
                Thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <form 
        onSubmit={handleSend}
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--glass-border)',
          background: 'var(--bg-dark-60)',
          display: 'flex',
          gap: '12px'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about stocks or market..."
          disabled={loading}
          className="input-field"
          style={{
            flexGrow: 1,
            borderRadius: '8px',
            fontSize: '14px',
            background: 'var(--bg-dark-80)'
          }}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{
            padding: '12px 18px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={16} />
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
