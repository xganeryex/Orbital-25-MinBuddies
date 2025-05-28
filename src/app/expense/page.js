"use client";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";


export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "expenses"), {
      amount: parseFloat(amount),
      category,
      note,
      createdAt: new Date()
    });
    alert("Expense added!");
    setAmount("");
    setCategory("");
    setNote("");
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
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        />
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
    </main>
  );
}
const addExpense = async () => {
  await addDoc(collection(db, "expenses"), {
    amount: expenseAmount,
    category: expenseCategory,
    date: new Date()
  });
};
