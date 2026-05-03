import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Try popup first; if it fails (blocked, cross-origin, etc.)
 * fall back to redirect so the user still gets signed in.
 */
export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    const popupErrors = [
      'auth/popup-blocked',
      'auth/popup-closed-by-user',
      'auth/cancelled-popup-request',
    ];
    if (popupErrors.some(code => err.code === code)) {
      // Fall back to redirect — page will reload and App picks up result
      await signInWithRedirect(auth, googleProvider);
      return null; // never reached (page redirects)
    }
    throw err; // rethrow real errors (wrong config, network, etc.)
  }
};

/** Call this once on app boot to capture the redirect result */
export const checkRedirectResult = () => getRedirectResult(auth);

export const signInEmail = (email, pass) =>
  signInWithEmailAndPassword(auth, email, pass);

export const signUpEmail = (email, pass, name) =>
  createUserWithEmailAndPassword(auth, email, pass).then(async (cred) => {
    await updateProfile(cred.user, { displayName: name });
    return cred;
  });

export const logout = () => signOut(auth);

