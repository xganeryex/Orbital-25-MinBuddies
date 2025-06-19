"use client";

import { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";


export default function IncomeForm() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [customSource, setCustomSource] = useState("");


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
        createdAt: new Date(),
      });
      alert("Income logged!");
      setAmount("");
      setSource("");
      setNote("");
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Log Income</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />
        <select
  value={source}
  onChange={(e) => setSource(e.target.value)}
  className="border p-2 w-full"
>
  <option value="">Select Source</option>
  <option value="Salary">Salary</option>
  <option value="Allowance">Allowance</option>
  <option value="Freelance">Freelance</option>
  <option value="Gift">Gift</option>
  <option value="Others">Others</option>
</select>

{source === "Others" && (
  <input
    type="text"
    placeholder="Specify other source"
    value={customSource}
    onChange={(e) => setCustomSource(e.target.value)}
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Income
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
