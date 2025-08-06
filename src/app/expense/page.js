"use client";
import { useState } from "react";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function ExpenseForm() {
  const [user] = useAuthState(auth);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to add expenses.");
      return;
    }

    if (!amount || !category) {
      toast.error("Please fill in all fields.");
      return;
    }

    const finalCategory = category === "Others" ? customCategory : category;
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      toast.error("Amount must be a valid number.");
      return;
    }

    try {
      // Lấy ngân sách
      const budgetRef = doc(db, "budgets", `${user.uid}_${finalCategory}`);
      const budgetSnap = await getDoc(budgetRef);
      const budgetLimit = budgetSnap.exists() ? budgetSnap.data().amount : null;

      // Tổng chi tiêu hiện tại trong tháng
      const firstDayOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const expenseQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
        where("category", "==", finalCategory),
        where("createdAt", ">=", firstDayOfMonth)
      );
      const snapshot = await getDocs(expenseQuery);
      const totalSoFar = snapshot.docs.reduce(
        (sum, doc) => sum + doc.data().amount,
        0
      );
      const newTotal = totalSoFar + parsedAmount;

      // Lưu expense
      await addDoc(collection(db, "expenses"), {
        amount: parsedAmount,
        category: finalCategory,
        note,
        createdAt: new Date(),
        userId: user.uid,
      });

      toast.success("✅ Expense added!");

      if (budgetLimit && newTotal > budgetLimit) {
        setTimeout(() => {
          toast.warning("⚠️ You have exceeded your budget for this category!");
        }, 800); 
      }

      // Reset form
      setAmount("");
      setCategory("");
      setNote("");
      setCustomCategory("");
    } catch (error) {
      console.error("Error adding expense: ", error);
      toast.error("Something went wrong.");
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
          className="border p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 transition duration-200"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 transition duration-200"
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
            className="border p-2 w-full mt-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 transition duration-200"
            whileFocus={{ scale: 1.02 }}
          />
        )}

        <motion.input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 transition duration-200"
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
