import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
//import { GoogleAuthProvider } from 'firebase/auth/web-extension';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHtwKgYClG079F_KP2gDp4Ac7gXQiGQl4",
  authDomain: "portifolio-d9c98.firebaseapp.com",
  projectId: "portifolio-d9c98",
  storageBucket: "portifolio-d9c98.firebasestorage.app",
  messagingSenderId: "1077455395458",
  appId: "1:1077455395458:web:8f0265f3d65311d97e729b"
  //measurementId: "G-VQFWWK885T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();