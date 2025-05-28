"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Dashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let incomeSum = 0;
      let expenseSum = 0;

      // Fetch income
      const incomeSnap = await getDocs(collection(db, "income"));
      const incomeList = [];
      incomeSnap.forEach((doc) => {
        const data = doc.data();
        incomeSum += data.amount;
        incomeList.push(data);
      });

      // Fetch expenses
      const expenseSnap = await getDocs(collection(db, "expenses"));
      const expenseList = [];
      expenseSnap.forEach((doc) => {
        const data = doc.data();
        expenseSum += data.amount;
        expenseList.push(data);
      });

      setTotalIncome(incomeSum);
      setTotalExpense(expenseSum);

      // Recent income (latest 5 by createdAt)
      const incomeQuery = query(
        collection(db, "income"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentIncomeSnap = await getDocs(incomeQuery);
      const incomeRecent = recentIncomeSnap.docs.map(doc => doc.data());
      setRecentIncome(incomeRecent);

      // Recent expenses (latest 5 by createdAt)
      const expenseQuery = query(
        collection(db, "expenses"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentExpenseSnap = await getDocs(expenseQuery);
      const expenseRecent = recentExpenseSnap.docs.map(doc => doc.data());
      setRecentExpenses(expenseRecent);
    };

    fetchData();
  }, []);

  const balance = totalIncome - totalExpense;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-indigo-600">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white font-semibold">
        <div className="bg-green-500 p-4 rounded-lg text-center">
          <p>Total Income</p>
          <p className="text-2xl">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-500 p-4 rounded-lg text-center">
          <p>Total Expenses</p>
          <p className="text-2xl">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-blue-500 p-4 rounded-lg text-center">
          <p>Balance</p>
          <p className="text-2xl">${balance.toFixed(2)}</p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold mb-2">Recent Income</h2>
          <ul className="space-y-2">
            {recentIncome.map((item, index) => (
              <li key={index} className="p-3 border rounded-lg shadow-sm">
                💰 ${item.amount} – {item.source || "Unknown Source"}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Recent Expenses</h2>
          <ul className="space-y-2">
            {recentExpenses.map((item, index) => (
              <li key={index} className="p-3 border rounded-lg shadow-sm">
                🧾 ${item.amount} – {item.category || "Unknown Category"}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
