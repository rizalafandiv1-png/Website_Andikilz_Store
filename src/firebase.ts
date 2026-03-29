import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../firebase-applet-config.json';

// Ambil nilai dari env atau fallback ke JSON
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId;
const appId = import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId;
const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || firebaseConfigJson.firestoreDatabaseId;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  appId,
};

// Pastikan config tidak kosong sebelum inisialisasi
let app;
try {
  if (!apiKey) {
    console.warn("Firebase API Key is missing. Check your environment variables.");
  }
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Fallback minimal agar tidak blank
  app = initializeApp(firebaseConfigJson);
}

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);
