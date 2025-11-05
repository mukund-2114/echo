import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, signInAnonymously, getAuth, type Auth } from 'firebase/auth';
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

// Initialize Auth for React Native: prefer AsyncStorage persistence, fallback to memory
let authInst: Auth;
try {
  // Try React Native specific auth initializer first
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rnAuth = require('firebase/auth/react-native');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNAsyncStorage = require('@react-native-async-storage/async-storage').default;
  authInst = rnAuth.initializeAuth(app, {
    persistence: rnAuth.getReactNativePersistence(RNAsyncStorage),
  });
} catch (e) {
  try {
    // Fallback to generic auth module
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webAuth = require('firebase/auth');
    authInst = getAuth(app);
  } catch {
    authInst = getAuth(app);
  }
}
export const auth: Auth = authInst;
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
