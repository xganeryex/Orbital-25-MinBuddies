// src/app/page.js
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
      <p>Firebase đã kết nối thành công!</p>
    </main>
  );
}
