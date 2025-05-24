// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Thay thế firebaseConfig này bằng thông tin của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAtsgyCbjESUzTlRY-o7ywVMEpC5bwafg",
  authDomain: "savepal-30f07.firebaseapp.com",
  projectId: "savepal-30f07",
  storageBucket: "savepal-30f07.appspot.com",
  messagingSenderId: "782974981413",
  appId: "1:782974981413:web:0ac03b514b1f3a76c2b6cc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
