import { useState, useEffect } from 'react';
import { signInEmail, signUpEmail, signInWithGoogle } from '../firebase.js';

// ── Detect if Firebase env vars are still placeholders ──────────────────────
const FIREBASE_CONFIGURED =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('your_');

// ── Error code → human message map (outside component for perf) ─────────────
const GOOGLE_ERRORS = {
  'auth/popup-blocked':             null,  // handled by redirect fallback
  'auth/popup-closed-by-user':      'Sign-in cancelled. Please try again.',
  'auth/cancelled-popup-request':   null,  // duplicate click — suppress
  'auth/network-request-failed':    'Network error. Check your internet connection.',
  'auth/invalid-api-key':           'config:invalid-key',
  'auth/configuration-not-found':   'config:not-enabled',
  'auth/operation-not-allowed':     'config:not-enabled',
  'auth/unauthorized-domain':       'config:bad-domain',
  'auth/user-disabled':             'This account has been disabled.',
  'auth/internal-error':            'config:not-enabled',
};

const EMAIL_ERRORS = {
  'auth/user-not-found':            'No account with this email. Sign up instead?',
  'auth/wrong-password':            'Incorrect password. Please try again.',
  'auth/invalid-credential':        'Incorrect email or password.',
  'auth/email-already-in-use':      'An account with this email already exists. Sign in instead.',
  'auth/weak-password':             'Password must be at least 6 characters.',
  'auth/invalid-email':             'Please enter a valid email address.',
  'auth/too-many-requests':         'Too many attempts. Please wait a few minutes.',
  'auth/network-request-failed':    'Network error. Check your internet connection.',
};

const translations = {
  en: {
    welcome: 'Meet Ira',
    sub: 'Your emotionally intelligent AI companion',
    login: 'Sign In', signup: 'Sign Up',
    name: 'Your Name', email: 'Email', password: 'Password',
    loginBtn: 'Sign In', signupBtn: 'Create Account',
    or: 'or',
    google: 'Continue with Google',
    namePh: 'What should Ira call you?',
    emailPh: 'you@email.com', passPh: '••••••••',
  },
  hi: {
    welcome: 'मिलिए इरा से',
    sub: 'आपकी भावनात्मक AI साथी',
    login: 'लॉग इन', signup: 'साइन अप',
    name: 'आपका नाम', email: 'ईमेल', password: 'पासवर्ड',
    loginBtn: 'लॉग इन करें', signupBtn: 'अकाउंट बनाएं',
    or: 'या',
    google: 'Google से जारी रखें',
    namePh: 'इरा आपको क्या बुलाए?',
    emailPh: 'आप@ईमेल.com', passPh: '••••••••',
  },
};

// ── Setup guide shown when Firebase config is wrong ─────────────────────────
function SetupGuide({ reason }) {
  const steps = {
    'config:invalid-key': [
      'Open Ira/.env and paste your real Firebase credentials.',
      'Run: npm run dev (restart the server after .env changes).',
    ],
    'config:not-enabled': [
      'Go to Firebase Console → your project.',
      'Click Authentication → Sign-in method.',
      'Enable Google → save.',
    ],
    'config:bad-domain': [
      'Go to Firebase Console → Authentication → Settings.',
      'Under Authorised domains, add: localhost',
      'For production, add your actual domain too.',
    ],
  }[reason] || [
    'Open Ira/.env and fill in all VITE_FIREBASE_* values.',
    'Enable Google sign-in in Firebase Console → Authentication.',
    'Restart the dev server after editing .env.',
  ];

  return (
    <div className="setup-guide">
      <div className="setup-guide-title">🛠 Setup needed</div>
      <ol className="setup-steps">
        {steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <a
        href="https://console.firebase.google.com"
        target="_blank"
        rel="noreferrer"
        className="setup-link"
      >
        Open Firebase Console →
      </a>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AuthScreen({ lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [tab, setTab]           = useState('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [setupReason, setSetupReason] = useState(
    FIREBASE_CONFIGURED ? '' : 'config:invalid-key'
  );
  const [redirecting, setRedirecting] = useState(false);

  // Clear setup guide when user dismisses or changes tab
  const clearError = () => { setError(''); setSetupReason(''); };

  // ── Email / password ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      if (tab === 'login') {
        await signInEmail(email, password);
      } else {
        if (!name.trim()) throw { code: 'custom/name-required' };
        await signUpEmail(email, password, name.trim());
      }
    } catch (err) {
      if (err.code === 'custom/name-required') {
        setError('Please enter your name.');
      } else {
        const mapped = EMAIL_ERRORS[err.code];
        setError(mapped || err.message?.replace('Firebase: ', '').replace(/\(auth\/.*?\)\.?/, '').trim() || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google sign-in ──────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clearError();
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result === null) {
        // Redirect initiated — page will reload shortly
        setRedirecting(true);
      }
    } catch (err) {
      const mapped = GOOGLE_ERRORS[err.code];
      if (mapped === null) {
        /* suppress (duplicate click, etc.) */
      } else if (mapped?.startsWith('config:')) {
        setSetupReason(mapped);
        setError('');
      } else if (mapped) {
        setError(mapped);
      } else {
        const raw = err.message?.replace('Firebase: ', '').replace(/\(auth\/.*?\)\.?/, '').trim();
        setError(raw || 'Google sign-in failed. Please try again.');
        console.error('Google auth error:', err.code, err.message);
      }
    } finally {
      if (!redirecting) setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (redirecting) {
    return (
      <div className="auth-screen">
        <div className="auth-overlay" />
        <div className="auth-form-pane">
          <div className="auth-card" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <div className="auth-ira-avatar">🌸</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 8 }}>Redirecting to Google…</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>You'll be brought back here automatically.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-overlay" />

      {/* Floating Elements */}
      <div className="auth-pill pill-tl">
        who is ira?
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>

      <div className="auth-pill pill-tr">
        <strong>ira:</strong> the most human ai.
      </div>

      <div className="auth-pill pill-bl">
        ira's feed
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
      </div>

      <div className="brand-watermark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6-6.2-4.5h7.6z"/></svg>
        rumik.ai
      </div>

      <div className="auth-pill pill-br">
        <div className="pill-avatar">🌸</div>
        <span style={{ marginLeft: 4, marginRight: 8, fontWeight: 700 }}>ira_rumik</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </div>

      {/* ── Right Form Pane (now Center Phone Mockup) ── */}
      <div className="auth-form-pane">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-ira-avatar">🌸</div>
            <h2 className="auth-title">{t.welcome}</h2>
            <p className="auth-subtitle">{t.sub}</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); clearError(); }}>
              {t.login}
            </button>
            <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => { setTab('signup'); clearError(); }}>
              {t.signup}
            </button>
          </div>

          {/* Config setup guide */}
          {setupReason && <SetupGuide reason={setupReason} />}

          {/* Error */}
          {error && <div className="auth-error">{error}</div>}

          {/* Email form */}
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {tab === 'signup' && (
              <div className="form-group">
                <label className="form-label">{t.name}</label>
                <input className="form-input" type="text" placeholder={t.namePh}
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">{t.email}</label>
              <input className="form-input" type="email" placeholder={t.emailPh}
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 'auto' }}>
              <label className="form-label">{t.password}</label>
              <input className="form-input" type="password" placeholder={t.passPh}
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={6} />
            </div>
            <button className="primary-btn" type="submit" disabled={loading} style={{ marginTop: 20 }}>
              {loading ? '...' : (tab === 'login' ? t.loginBtn : t.signupBtn)}
            </button>
          </form>

          <div className="divider">{t.or}</div>

          {/* Google button */}
          <button className="google-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? '...' : t.google}
          </button>
        </div>
      </div>
    </div>
  );
}
