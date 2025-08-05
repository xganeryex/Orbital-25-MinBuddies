"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";

export default function BudgetPage() {
  const [user] = useAuthState(auth);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "budgets"));
      const data = querySnapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((b) => b.userId === user.uid);
      setBudgets(data);
    };

    fetchBudgets();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to set budgets.");
      return;
    }

    if (!category || !amount || !month) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "budgets", editingId), {
          category,
          amount: parseFloat(amount),
          month,
          userId: user.uid,
        });
        alert("Budget updated!");
      } else {
        await addDoc(collection(db, "budgets"), {
          category,
          amount: parseFloat(amount),
          month,
          userId: user.uid,
        });
        alert("Budget saved!");
      }

      setCategory("");
      setAmount("");
      setMonth("");
      setEditingId(null);
      window.location.reload();
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this budget?")) {
      try {
        await deleteDoc(doc(db, "budgets", id));
        alert("Budget deleted!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting budget:", error);
        alert("Failed to delete.");
      }
    }
  };

  const handleEdit = (budget) => {
    setCategory(budget.category);
    setAmount(budget.amount.toString());
    setMonth(budget.month);
    setEditingId(budget.id);
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <motion.h1
        className="text-xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {editingId ? "Edit Budget" : "Set Monthly Budget"}
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
            placeholder="Specify category"
            value={category.startsWith("Other:") ? category.slice(6) : ""}
            onChange={(e) => setCategory(`Other:${e.target.value}`)}
            className="border p-2 w-full"
            whileFocus={{ scale: 1.02 }}
          />
        )}

        <motion.input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 w-full"
          whileFocus={{ scale: 1.02 }}
        />

        <div className="flex gap-2">
          <motion.button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editingId ? "Update Budget" : "Save Budget"}
          </motion.button>
          {editingId && (
            <motion.button
              type="button"
              onClick={() => {
                setCategory("");
                setAmount("");
                setMonth("");
                setEditingId(null);
              }}
              className="bg-gray-300 px-4 py-2 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          )}
        </div>
      </motion.form>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-bold mb-2">Current Budgets</h2>
        <ul className="space-y-2">
          {budgets.map((b, i) => (
            <motion.li
              key={b.id}
              className="p-3 border rounded flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <span>
                🏷️ {b.category} — ${b.amount.toFixed(2)} ({b.month})
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(b)}
                  className="text-blue-500 hover:underline"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-red-500 hover:underline"
                >
                  🗑️
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
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
