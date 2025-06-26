// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtStgyCbjESUzITRy-o7ywVMEpC5bwafg",
  authDomain: "savepal-30f07.firebaseapp.com",
  projectId: "savepal-30f07",
  storageBucket: "savepal-30f07.firebasestorage.app",
  messagingSenderId: "782974981413",
  appId: "1:782974981413:web:e95e9924200fc91ac2b6cc",
  measurementId: "G-XEMXF1RJ87"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
