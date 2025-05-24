# SavePal – Setup Firebase & Project Structure

## 🎯 Objective
- Integrate Firebase with Next.js
- Create a clean project structure for app development

---

## 🔧 Steps Completed

### 1️. Create the Next.js project
```bash
npx create-next-app savepal
cd savepal

**### 2. Install Firebase SDK**
npm install firebase

**### 3. Create the Firsebase configurartion file**
Create a new folder: src/firebase/
Create the file: firebase.js with the following content:

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
**### 4. test Firebase connection**
In src/app/page.js:
"use client";

import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    };
    test();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold text-green-600">SavePal</h1>
      <p>Firebase connected successfully!</p>
    </main>
  );
}

### 5. Git workflow
git add .
git commit -m "Completed task 1: Setup Firebase & project structure"
git push -u origin master

