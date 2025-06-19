"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function IncomeExpenseBarChart({ incomeData, expenseData }) {
  const monthlyTotals = {};

  // Process income
  incomeData.forEach((item) => {
    const date = item.createdAt?.toDate?.() || new Date(item.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
        };
      }
      monthlyTotals[monthKey].income += item.amount; 
      
  });

  // Process expense
  expenseData.forEach((item) => {
    const date = item.createdAt?.toDate?.() || new Date(item.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
        };
      }
      monthlyTotals[monthKey].expense += item.amount; 
      
  });

  const chartData = Object.values(monthlyTotals).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
  
  

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#4ade80" />
          <Bar dataKey="expense" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
