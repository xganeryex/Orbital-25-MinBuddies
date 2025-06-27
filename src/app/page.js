// src/app/page.js
"use client";

import { db, auth } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // ⛔ nếu chưa đăng nhập
      } else {
        setLoading(false);     // ✅ cho phép truy cập
        fetchExpenses();       // gọi các tính năng ban đầu
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchExpenses = async () => {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  return (
    <main className="p-4 text-center" suppressHydrationWarning={true}>
      <h1 className="text-2xl font-bold text-green-600 mb-4">SavePal</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Log Out
      </button>

      <div className="mt-4 space-y-4">
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
