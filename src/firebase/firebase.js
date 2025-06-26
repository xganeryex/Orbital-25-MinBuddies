// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtStgyCbjESUzITRy-o7ywVMcEpC5bwafg", // <-- cần chính xác
  authDomain: "savepal-30f07.firebaseapp.com",
  projectId: "savepal-30f07",
  storageBucket: "savepal-30f07.appspot.com",
  messagingSenderId: "782974981413",
  appId: "1:782974981413:web:0ac83b514b1f3a76c2b6cc",
  measurementId: "G-DQ5QJWSVL8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
