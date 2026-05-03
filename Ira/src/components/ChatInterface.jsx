import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Brain, LogOut } from 'lucide-react';
import Message from './Message.jsx';
import MemoryPanel from './MemoryPanel.jsx';

const SUGGESTIONS = {
  en: [
    "How are you, Ira? 🌸",
    "I'm feeling a bit stressed today",
    "Tell me something interesting!",
    "I had a great day today",
  ],
  hi: [
    "इरा, तुम कैसी हो? 🌸",
    "आज मैं थोड़ा तनाव में हूं",
    "कुछ दिलचस्प बताओ!",
    "आज मेरा दिन बहुत अच्छा था",
  ],
};

const WELCOME = {
  en: (name) => `Hi ${name}! I'm Ira 🌸 I'm so glad you're here. How are you feeling today?`,
  hi: (name) => `नमस्ते ${name}! मैं इरा हूं 🌸 मुझे खुशी है कि आप आए। आज आप कैसा महसूस कर रहे हैं?`,
};

export default function ChatInterface({ user, lang, setLang, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const userName = user?.displayName?.split(' ')[0] || 'friend';

  // Add welcome message on mount
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: WELCOME[lang]?.(userName) || WELCOME.en(userName),
      timestamp: Date.now(),
      emotion: 'joy',
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: msg, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history, language: lang, userId: user?.uid }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        emotion: data.emotion,
        timestamp: Date.now(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'hi' ? 'माफ करना, कुछ गड़बड़ हो गई। फिर से कोशिश करें।' : "Sorry, something went wrong. Please try again.",
        timestamp: Date.now(),
        emotion: 'neutral',
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, lang, user?.uid]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');

  return (
    <>
      <div className="ira-app">
        {/* Header */}
        <header className="ira-header">
          <div className="ira-logo">
            <div className="ira-avatar-small">🌸</div>
            <div>
              <div className="ira-name">Ira</div>
              <div className="ira-status">{lang === 'hi' ? 'ऑनलाइन' : 'online'}</div>
            </div>
          </div>

          <div className="header-controls">
            {/* Language Toggle */}
            <div className="lang-toggle">
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हि</button>
            </div>

            {/* Memory */}
            <button className="icon-btn" onClick={() => setMemoryOpen(true)} title="Memory">
              <Brain size={16} />
            </button>

            {/* Logout */}
            <button className="icon-btn" onClick={onLogout} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="chat-area">
          {messages.length === 1 && (
            <div className="suggestion-chips">
              {SUGGESTIONS[lang].map((s, i) => (
                <button key={i} className="chip" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <Message key={i} msg={msg} lang={lang} />
          ))}

          {loading && (
            <div className="typing-row">
              <div className="msg-avatar ira-av">🌸</div>
              <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-bar">
            <textarea
              ref={textareaRef}
              className="chat-input"
              rows={1}
              placeholder={lang === 'hi' ? 'इरा से कुछ भी कहें...' : 'Say anything to Ira...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </div>
          <div className="input-hint">
            {lang === 'hi' ? 'Enter दबाएं भेजने के लिए • Shift+Enter नई लाइन' : 'Enter to send • Shift+Enter for new line'}
          </div>
        </div>
      </div>

      {/* Memory Panel */}
      <MemoryPanel
        open={memoryOpen}
        onClose={() => setMemoryOpen(false)}
        userId={user?.uid}
        lang={lang}
      />
    </>
  );
}
