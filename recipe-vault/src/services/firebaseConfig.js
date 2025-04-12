// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBALWfzsnyivtBnTGygR9tyyHtw3168cvk",
  authDomain: "db1503-9b410.firebaseapp.com",
  projectId: "db1503-9b410",
  storageBucket: "db1503-9b410.firebasestorage.app",
  messagingSenderId: "729149698068",
  appId: "1:729149698068:web:93fe0c3daa260c7e933701",
  measurementId: "G-QW5WMRWF5D",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
