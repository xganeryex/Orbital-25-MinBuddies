"use client";
import { useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";

export default function ExpenseForm() {
  const [user] = useAuthState(auth);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add expenses.");
      return;
    }

    if (!amount || !category) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(amount),
        category: category === "Others" ? customCategory : category,
        note,
        createdAt: new Date(),
        userId: user.uid,
      });
      alert("Expense added!");
      setAmount("");
      setCategory("");
      setNote("");
      setCustomCategory("");
    } catch (error) {
      console.error("Error adding expense: ", error);
      alert("Something went wrong.");
    }
  };

  return (
    <main className="p-4">
      <motion.h1
        className="text-xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Log Expense
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
          className="border p-2 w-full"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Others">Others</option>
        </motion.select>

        {category === "Others" && (
          <motion.input
            type="text"
            placeholder="Specify other category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="border p-2 w-full mt-2"
            whileFocus={{ scale: 1.02 }}
          />
        )}

        <motion.input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Expense
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
