"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IncomeForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [customSource, setCustomSource] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !source) {
      alert("Please enter both amount and source.");
      return;
    }

    try {
      await addDoc(collection(db, "incomes"), {
        amount: parseFloat(amount),
        source: source === "Others" ? customSource : source,
        note,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });

      alert("Income logged!");
      setAmount("");
      setSource("");
      setNote("");
      setCustomSource("");
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Something went wrong.");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <main className="p-4">
      <motion.h1
        className="text-xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Log Income
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">Select Source</option>
          <option value="Salary">Salary</option>
          <option value="Allowance">Allowance</option>
          <option value="Freelance">Freelance</option>
          <option value="Gift">Gift</option>
          <option value="Others">Others</option>
        </motion.select>

        {source === "Others" && (
          <motion.input
            type="text"
            placeholder="Specify other source"
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
            className="border p-2 w-full mt-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
            whileFocus={{ scale: 1.02 }}
          />
        )}

        <motion.input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Income
        </motion.button>
      </motion.form>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </main>
  );
}

