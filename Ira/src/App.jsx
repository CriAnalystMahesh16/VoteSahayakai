import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logout, checkRedirectResult } from './firebase.js';
import AuthScreen from './components/AuthScreen.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('ira-lang') || 'en');

  // Capture Google redirect sign-in result on page load
  useEffect(() => {
    checkRedirectResult().catch((err) => {
      // Suppress "no redirect pending" — that's normal on first load
      if (err?.code !== 'auth/no-auth-event') {
        console.error('Redirect result error:', err?.message);
      }
    });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    localStorage.setItem('ira-lang', lang);
  }, [lang]);

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--grad-bg)',
      }}>
        <div style={{
          width: 64, height: 64,
          borderRadius: '50%',
          background: 'var(--grad-ira)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          animation: 'float 2s ease-in-out infinite',
        }}>🌸</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading Ira...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen lang={lang} />;
  }

  return (
    <ChatInterface
      user={user}
      lang={lang}
      setLang={setLang}
      onLogout={logout}
    />
  );
}
