"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-indigo-600">SavePal</h1>

      <nav className="flex items-center gap-4">
        <Link href="/" className="text-gray-800 dark:text-white hover:underline">
          Home
        </Link>
        <Link href="/dashboard" className="text-gray-800 dark:text-white hover:underline">
          Dashboard
        </Link>
        <Link href="/budget" className="text-gray-800 dark:text-white hover:underline">
          Budget
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
