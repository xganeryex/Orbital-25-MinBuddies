// src/app/page.js
"use client";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import Link from "next/link";

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
    <main className="p-4 text-center" suppressHydrationWarning={true}>
      <h1 className="text-2xl font-bold text-green-600 mb-4">SavePal</h1>

      <div className="mt-8 space-y-4">
        <Link href="/income" className="block bg-blue-500 text-white px-4 py-2 rounded">
          Go to Income Form
        </Link>
        <Link href="/expense" className="block bg-green-500 text-white px-4 py-2 rounded">
          Go to Expense Form
        </Link>
        <Link href="/dashboard" className="block bg-purple-500 text-white px-4 py-2 rounded">
          Go to Dashboard
        </Link>
        <Link href="/budget" className="block bg-yellow-500 text-white px-4 py-2 rounded">
          Set Budget
        </Link>
      </div>
    </main>
  );
}
