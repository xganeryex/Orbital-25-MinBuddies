"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import Link from "next/link";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function BudgetPage() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [budgets, setBudgets] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // 🧠 Fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      const querySnapshot = await getDocs(collection(db, "budgets"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setBudgets(data);
    };
    fetchBudgets();
  }, []);

  // ✅ Add or Update budget
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !amount || !month) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (editingId) {
        // Update existing
        await updateDoc(doc(db, "budgets", editingId), {
          category,
          amount: parseFloat(amount),
          month,
        });
        alert("Budget updated!");
      } else {
        // Add new
        await addDoc(collection(db, "budgets"), {
          category,
          amount: parseFloat(amount),
          month,
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

  // ❌ Delete budget
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

  // ✏️ Start editing
  const handleEdit = (budget) => {
    setCategory(budget.category);
    setAmount(budget.amount.toString());
    setMonth(budget.month);
    setEditingId(budget.id);
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {editingId ? "Edit Budget" : "Set Monthly Budget"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border p-2 w-full"
>
  <option value="">Select Category</option>
  <option value="Food">Food</option>
  <option value="Transport">Transport</option>
  <option value="Bills">Bills</option>
  <option value="Shopping">Shopping</option>
  <option value="Others">Others</option>
</select>

{category === "Others" && (
  <input
    type="text"
    placeholder="Specify category"
    value={category.startsWith("Other:") ? category.slice(6) : ""}
    onChange={(e) => setCategory(`Other:${e.target.value}`)}
    className="border p-2 w-full"
  />
)}



        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 w-full"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Budget" : "Save Budget"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setAmount("");
                setMonth("");
                setEditingId(null);
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Current Budgets</h2>
        <ul className="space-y-2">
          {budgets.map((b) => (
            <li key={b.id} className="p-3 border rounded flex justify-between items-center">
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
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-center">
  <Link
    href="/"
    className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
  >
    ← Back to Home
  </Link>
</div>
    </main>
  );
}
