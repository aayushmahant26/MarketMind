import React from 'react';
import ChatBox from '../components/ChatBox';
import { MessageSquare, Sparkles, Terminal, Info } from 'lucide-react';

const ChatPage = () => {
  
  const recommendedPrompts = [
    { title: "RSI Checks", query: "What is the current RSI of INFY?" },
    { title: "Indicators", query: "Summarize the technical indicators for RELIANCE." },
    { title: "Levels", query: "What are the key support and resistance zones for TCS?" },
    { title: "Market Bias", query: "Is NIFTY showing bullish or bearish signs today?" }
  ];

  const handleCopyToClipboard = (queryText) => {
    // We can auto-write this text into the chat input by triggering a dispatch or simply copy it
    // But since the chat page owns the ChatBox, if we want to copy it to clipboard or set it, 
    // copying to clipboard with a notify is standard and convenient!
    navigator.clipboard.writeText(queryText);
    alert(`Copied: "${queryText}"\nPaste it in the message box below!`);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '3fr 1fr',
      gap: '30px'
    }} className="chat-layout-grid animate-fade-in">
      
      {/* Left Area: Chat Terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ChatBox />
      </div>

      {/* Right Area: Prompt Guide */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Prompt Guides */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-white)' }}>
            <Sparkles size={18} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>Quick Prompts</h3>
          </div>
          
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
            Click any prompt to copy it, select the corresponding stock context in the dropdown, and prompt the AI.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendedPrompts.map((p, idx) => (
              <div 
                key={idx}
                onClick={() => handleCopyToClipboard(p.query)}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-card-40)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.background = 'var(--color-primary-10)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--bg-card-40)';
                }}
              >
                <span style={{ fontWeight: 'bold', color: 'var(--color-white)', display: 'block', marginBottom: '2px' }}>
                  {p.title}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  "{p.query}"
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-card" style={{ 
          background: 'var(--color-muted-10)',
          border: '1px dashed var(--color-muted-30)',
          padding: '16px',
          display: 'flex',
          gap: '10px',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          lineHeight: '1.4'
        }}>
          <Info size={16} color="var(--color-lavender)" style={{ flexShrink: 0 }} />
          <span>
            The assistant remembers your conversation. Click the clear icon to reset chat history.
          </span>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .chat-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
