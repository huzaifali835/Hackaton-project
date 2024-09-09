import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyBe9UHw_ZATU97KZoz6maDxfniHfZvWPR0",
  authDomain: "hackaton-app-5343e.firebaseapp.com",
  projectId: "hackaton-app-5343e",
  storageBucket: "hackaton-app-5343e.appspot.com",
  messagingSenderId: "111155758268",
  appId: "1:111155758268:web:e18c16c399e2e6d4d33cb9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
export const database = getDatabase(app);