import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIa1xdornrQLyKSWqStxpXbR_ZEe7s11E",
  authDomain: "votesahayakai-a6f9b.firebaseapp.com",
  projectId: "votesahayakai-a6f9b",
  storageBucket: "votesahayakai-a6f9b.firebasestorage.app",
  messagingSenderId: "837786791028",
  appId: "1:837786791028:web:2830a99987345811a4f521"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
