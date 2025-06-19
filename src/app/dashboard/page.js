"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import ExpensePieChart from "../../components/ExpensePieChart";
import IncomePieChart from "../../components/IncomePieChart";



export default function Dashboard() {
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



  

  useEffect(() => {
    const fetchData = async () => {
      let incomeSum = 0;
      let expenseSum = 0;

      // Fetch income
      const incomeSnap = await getDocs(collection(db, "incomes"));
      const incomeList = [];
      const sourceTotals = {};

incomeSnap.forEach((doc) => {
  const data = doc.data();
  incomeSum += data.amount;
  incomeList.push(data);

  const source = data.source || "Uncategorized";
  if (!sourceTotals[source]) {
    sourceTotals[source] = 0;
  }
  sourceTotals[source] += data.amount;
});

setIncomeSourceTotals(sourceTotals);


      // Fetch expenses
      const expenseSnap = await getDocs(collection(db, "expenses"));
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

setExpenseCategoryTotals(categoryTotals);


      setTotalIncome(incomeSum);
      setTotalExpense(expenseSum);

      // Recent income (latest 5 by createdAt)
      const incomeQuery = query(
        collection(db, "incomes"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentIncomeSnap = await getDocs(incomeQuery);
      const incomeRecent = recentIncomeSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));


      setRecentIncome(incomeRecent);

      // Recent expenses (latest 5 by createdAt)
      const expenseQuery = query(
        collection(db, "expenses"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentExpenseSnap = await getDocs(expenseQuery);
      const expenseRecent = recentExpenseSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRecentExpenses(expenseRecent);
    };

    fetchData();
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

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-indigo-600">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
    <label className="block font-semibold mb-1">Filter Income by Source</label>
    <select
      value={selectedIncomeSource}
      onChange={(e) => setSelectedIncomeSource(e.target.value)}
      className="border p-2 w-full"
    >
      <option value="">All Sources</option>
      <option value="Salary">Salary</option>
      <option value="Allowance">Allowance</option>
      <option value="Freelance">Freelance</option>
      <option value="Gift">Gift</option>
      <option value="Others">Others</option>
    </select>
  </div>
  <div>
    <label className="block font-semibold mb-1">Filter Expenses by Category</label>
    <select
      value={selectedExpenseCategory}
      onChange={(e) => setSelectedExpenseCategory(e.target.value)}
      className="border p-2 w-full"
    >
      <option value="">All Categories</option>
      <option value="Food">Food</option>
      <option value="Transport">Transport</option>
      <option value="Bills">Bills</option>
      <option value="Shopping">Shopping</option>
      <option value="Others">Others</option>
    </select>
  </div>

  
</div>

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
          {recentIncome
  .filter((item) =>
    selectedIncomeSource ? item.source === selectedIncomeSource : true
  )
  .map((item) => (

  <li key={item.id} className="p-3 border rounded-lg shadow-sm">
    {editingIncomeId === item.id ? (
      <div className="space-y-2">
        <input
          type="number"
          value={editedIncome.amount}
          onChange={(e) => handleEditChange("amount", e.target.value)}
          className="border p-1 w-full"
        />


<select
  value={editedIncome.source}
  onChange={(e) => handleEditChange("source", e.target.value)}
  className="border p-1 w-full"
>
  <option value="">Select Source</option>
  <option value="Salary">Salary</option>
  <option value="Allowance">Allowance</option>
  <option value="Freelance">Freelance</option>
  <option value="Gift">Gift</option>
  <option value="Others">Others</option>
</select>

{editedIncome.source === "Others" && (
  <input
    type="text"
    placeholder="Specify other source"
    value={editedIncome.otherSource || ""}
    onChange={(e) =>
      setEditedIncome((prev) => ({
        ...prev,
        otherSource: e.target.value,
      }))
    }
    className="border p-1 w-full"
  />
)}




        <button
          onClick={handleSaveEdit}
          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
        >
          Save
        </button>
        <button
          onClick={() => setEditingIncomeId(null)}
          className="bg-gray-300 px-2 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    ) : (
      <div className="flex justify-between items-center">
        <span>💰 ${item.amount} – {item.source || "Unknown Source"}</span>
        <div className="space-x-2">
          <button
            onClick={() => {
              setEditingIncomeId(item.id);
              setEditedIncome({ amount: item.amount, source: item.source });
            }}
            className="text-blue-500 hover:underline"
          >
            📝
          </button>
          <button
            onClick={() => handleDelete("incomes", item.id)}
            className="text-red-500 hover:underline"
          >
            🗑️
          </button>
        </div>
      </div>
    )}
  </li>
))}

          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Recent Expenses</h2>
          <ul className="space-y-2">
            
          {recentExpenses
  .filter((item) =>
    selectedExpenseCategory ? item.category === selectedExpenseCategory : true
  )
  .map((item) => (

              <li key={item.id} className="p-3 border rounded-lg shadow-sm">
                {editingExpenseId === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={editedExpense.amount}
                      onChange={(e) => handleExpenseEditChange("amount", e.target.value)}
                      className="border p-1 w-full"
                    />


<select
  value={editedExpense.category}
  onChange={(e) => handleExpenseEditChange("category", e.target.value)}
  className="border p-1 w-full"
>
  <option value="">Select Category</option>
  <option value="Food">Food</option>
  <option value="Transport">Transport</option>
  <option value="Bills">Bills</option>
  <option value="Shopping">Shopping</option>
  <option value="Others">Others</option>
</select>
{editedExpense.category === "Others" && (
  <input
    type="text"
    placeholder="Specify other category"
    value={editedExpense.otherCategory || ""}
    onChange={(e) =>
      setEditedExpense((prev) => ({
        ...prev,
        otherCategory: e.target.value,
      }))
    }
    className="border p-1 w-full"
  />
)}





                    <button
                      onClick={handleSaveExpenseEdit}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingExpenseId(null)}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>🧾 ${item.amount} – {item.category || "Unknown Category"}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingExpenseId(item.id);
                          setEditedExpense({ amount: item.amount, category: item.category });
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete("expenses", item.id)}
                        className="text-red-500 hover:underline"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
            
          </ul>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
  <section>
    <h2 className="text-lg font-bold mb-2">Income by Source</h2>
    <ul className="space-y-1">
      {Object.entries(incomeSourceTotals).map(([source, total]) => (
        <li key={source} className="text-gray-800">
          • {source}: ${total.toFixed(2)}
        </li>
      ))}
    </ul>
  </section>

  <section>
    <h2 className="text-lg font-bold mb-2">Expenses by Category</h2>
    <ul className="space-y-1">
      {Object.entries(expenseCategoryTotals).map(([category, total]) => (
        <li key={category} className="text-gray-800">
          • {category}: ${total.toFixed(2)}
        </li>
      ))}
    </ul>
  </section>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <section>
    <h2 className="text-lg font-bold mb-2">Income Breakdown (Pie Chart)</h2>
    <IncomePieChart data={incomeSourceTotals} />
  </section>
  <section>
    <h2 className="text-lg font-bold mb-2">Expense Breakdown (Pie Chart)</h2>
    <ExpensePieChart data={expenseCategoryTotals} />
  </section>
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
