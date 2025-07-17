"use client";
import { useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

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
      <h1 className="text-xl font-bold mb-4">Log Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />

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
            placeholder="Specify other category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="border p-2 w-full mt-2"
          />
        )}

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </form>

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
