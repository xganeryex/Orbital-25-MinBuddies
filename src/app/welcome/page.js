"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <motion.div
        className="text-center max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-indigo-600">Welcome to SavePal! 🎉</h1>
        <p className="text-lg">
          You’ve successfully signed up. Let's start managing your money smartly.
        </p>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
