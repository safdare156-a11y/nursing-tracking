import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web configuration for the nursing-prof project.
const firebaseConfig = {
  apiKey: 'AIzaSyDm7ruo9aKqQZgv_MyivdQE0t2HR4oBgPs',
  authDomain: 'nursing-prof.firebaseapp.com',
  projectId: 'nursing-prof',
  storageBucket: 'nursing-prof.firebasestorage.app',
  messagingSenderId: '291706690548',
  appId: '1:291706690548:web:758e7dc3cbf8a4d7ccb7a1',
  measurementId: 'G-KZ07MC9G73',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

/**
 * Analytics only runs in supported browsers. This keeps tests and any future
 * server rendering from trying to access browser-only APIs.
 */
export let firebaseAnalytics: Analytics | undefined;

export async function initializeFirebaseAnalytics(): Promise<void> {
  try {
    if (typeof window === 'undefined' || !(await isSupported())) {
      return;
    }

    firebaseAnalytics = getAnalytics(firebaseApp);
  } catch {
    // Analytics is optional; leave the app usable if it is unavailable.
  }
}
