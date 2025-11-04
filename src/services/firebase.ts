import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Provided by user
const firebaseConfig = {
  apiKey: 'AIzaSyCTnNWZ-_3xwNkBHefPpFH4DDUVjkqsOV4',
  authDomain: 'echo-f6614.firebaseapp.com',
  projectId: 'echo-f6614',
  storageBucket: 'echo-f6614.firebasestorage.app',
  messagingSenderId: '1014857087307',
  appId: '1:1014857087307:web:8530bf5e5ab293f54350ce',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function ensureAnonymousAuth(): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          unsub();
          resolve(user.uid);
        } else {
          const cred = await signInAnonymously(auth);
          unsub();
          resolve(cred.user.uid);
        }
      } catch (e) {
        unsub();
        reject(e);
      }
    });
  });
}
