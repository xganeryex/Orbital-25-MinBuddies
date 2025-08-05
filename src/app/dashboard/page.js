"use client";

import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import ExpensePieChart from "../../components/ExpensePieChart";
import IncomePieChart from "../../components/IncomePieChart";
import IncomeExpenseBarChart from "../../components/IncomeExpenseBarChart";
import { motion } from "framer-motion";



export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [editedIncome, setEditedIncome] = useState({ amount: "", source: "" });
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({ amount: "", category: "" });
  const [expenseCategoryTotals, setExpenseCategoryTotals] = useState({});
  const [incomeSourceTotals, setIncomeSourceTotals] = useState({});
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [selectedIncomeSource, setSelectedIncomeSource] = useState("");
  const [allIncome, setAllIncome] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [alerts, setAlerts] = useState([]);




  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchData(user);
      } else {
        router.push("/login");
      }
    });
  
    async function fetchData(user) {
      let incomeSum = 0;
      let expenseSum = 0;
  
      // Fetch income
      const incomeSnap = await getDocs(
        query(collection(db, "incomes"), where("userId", "==", user.uid))
      );
      const incomeList = [];
      const sourceTotals = {};
  
      incomeSnap.forEach((doc) => {
        const data = doc.data();
        incomeSum += data.amount;
        incomeList.push(data);
        setAllIncome(incomeList);
  
        const source = data.source || "Uncategorized";
        if (!sourceTotals[source]) {
          sourceTotals[source] = 0;
        }
        sourceTotals[source] += data.amount;
      });
  
      setIncomeSourceTotals(sourceTotals);
  
      // Fetch expenses
      const expenseSnap = await getDocs(
        query(collection(db, "expenses"), where("userId", "==", user.uid))
      );
      const expenseList = [];
      const categoryTotals = {};
  
      expenseSnap.forEach((doc) => {
        const data = doc.data();
        expenseSum += data.amount;
        expenseList.push(data);
        
  
        const category = data.category || "Uncategorized";
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += data.amount;
      });


      setAllExpenses(expenseList);
      setExpenseCategoryTotals(categoryTotals);
      setTotalIncome(incomeSum);
      setTotalExpense(expenseSum);
  
      // Recent income
      const incomeQuery = query(
        collection(db, "incomes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      
      const recentIncomeSnap = await getDocs(incomeQuery);
      setRecentIncome(
        recentIncomeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
  
      // Recent expenses
      const expenseQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      
      const recentExpenseSnap = await getDocs(expenseQuery);
      setRecentExpenses(
        recentExpenseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
  
      // Budgets and alerts
      const budgetSnap = await getDocs(
        query(collection(db, "budgets"), where("userId", "==", user.uid))
      );
      const budgets = budgetSnap.docs.map(doc => doc.data());
  
      const currentMonth = new Date().toISOString().slice(0, 7);
      const triggeredAlerts = [];
  
      for (const budget of budgets) {
        if (budget.month === currentMonth) {
          const spent = expenseCategoryTotals[budget.category] || 0;
          if (spent > budget.amount) {
            triggeredAlerts.push({
              category: budget.category,
              spent,
              limit: budget.amount,
            });
          }
        }
      }
  
      setAlerts(triggeredAlerts);
    }
  
    return () => unsubscribe();
  }, []);
  

  const handleDelete = async (type, id) => {
    try {
      await deleteDoc(doc(db, type, id));
      alert(`${type === "incomes" ? "Income" : "Expense"} deleted!`);
      location.reload(); // refresh the page to update list
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete.");
    }
  };
  

const handleEditChange = (field, value) => {
  setEditedIncome(prev => ({ ...prev, [field]: value }));
};

const handleSaveEdit = async () => {
  try {
    const docRef = doc(db, "incomes", editingIncomeId);
    await updateDoc(docRef, {
      amount: parseFloat(editedIncome.amount),
      source:
        editedIncome.source === "Others"
          ? editedIncome.otherSource
          : editedIncome.source,
    });
    
    alert("Income updated!");
    setEditingIncomeId(null);
    location.reload(); // reload to show updated values
  } catch (error) {
    console.error("Edit failed:", error);
    alert("Could not update.");
  }
};
const handleExpenseEditChange = (field, value) => {
  setEditedExpense(prev => ({ ...prev, [field]: value }));
};

const handleSaveExpenseEdit = async () => {
  try {
    const docRef = doc(db, "expenses", editingExpenseId);
    await updateDoc(docRef, {
      amount: parseFloat(editedExpense.amount),
      category:
        editedExpense.category === "Others"
          ? editedExpense.otherCategory
          : editedExpense.category,
    });
    
    alert("Expense updated!");
    setEditingExpenseId(null);
    location.reload(); // refresh to show updated result
  } catch (error) {
    console.error("Expense edit failed:", error);
    alert("Could not update expense.");
  }
};



  const balance = totalIncome - totalExpense;

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
  <main className="p-6 space-y-6">
    <motion.h1
      className="text-2xl font-bold text-center text-indigo-600"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Dashboard
    </motion.h1>

    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Bộ lọc thu/chi */}
      ...
    </motion.div>

    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white font-semibold"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
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
    </motion.div>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Recent Income */}
      <div>
        <h2 className="text-lg font-bold mb-2">Recent Income</h2>
        <ul className="space-y-2">
          {recentIncome
            .filter((item) =>
              selectedIncomeSource ? item.source === selectedIncomeSource : true
            )
            .map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border rounded-lg shadow-sm"
              >
                {/* Income item content (giữ nguyên như cũ) */}
                ...
              </motion.li>
            ))}
        </ul>
      </div>

      {/* Recent Expenses */}
      <div>
        <h2 className="text-lg font-bold mb-2">Recent Expenses</h2>
        <ul className="space-y-2">
          {recentExpenses
            .filter((item) =>
              selectedExpenseCategory ? item.category === selectedExpenseCategory : true
            )
            .map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border rounded-lg shadow-sm"
              >
                {/* Expense item content (giữ nguyên như cũ) */}
                ...
              </motion.li>
            ))}
        </ul>
      </div>
    </section>

    <motion.div
      className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Income + Expense summary by category (giữ nguyên như cũ) */}
      ...
    </motion.div>

    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <section>
        <h2 className="text-lg font-bold mb-2">Income Breakdown (Pie Chart)</h2>
        <IncomePieChart data={incomeSourceTotals} />
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">Expense Breakdown (Pie Chart)</h2>
        <ExpensePieChart data={expenseCategoryTotals} />
      </section>
    </motion.div>

    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="text-lg font-bold mb-2">Income vs Expense by Month</h2>
      <IncomeExpenseBarChart incomeData={allIncome} expenseData={allExpenses} />
    </motion.section>

    {alerts.length > 0 && (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-red-100 border border-red-400 p-4 rounded text-red-800"
      >
        <h2 className="text-lg font-bold mb-2">🚨 Budget Alerts</h2>
        <ul className="space-y-1">
          {alerts.map((alert, idx) => (
            <li key={idx}>
              ⚠️ <strong>{alert.category}</strong>: spent ${alert.spent.toFixed(2)} / budget ${alert.limit.toFixed(2)}
            </li>
          ))}
        </ul>
      </motion.section>
    )}

    <motion.div
      className="mt-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
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
