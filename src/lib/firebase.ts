import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";

// Read Firebase config from the configuration JSON
const firebaseConfig = {
  apiKey: "AIzaSyDBlBHkpmUcUEJfOd3nZ27k_AH6QwDDwuA",
  authDomain: "gen-lang-client-0153999076.firebaseapp.com",
  projectId: "gen-lang-client-0153999076",
  storageBucket: "gen-lang-client-0153999076.firebasestorage.app",
  messagingSenderId: "1018680352902",
  appId: "1:1018680352902:web:05820fa8203aa73cafb107"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  onSnapshot
};
export type { FirebaseUser };
