"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! Redirecting to welcome...");
      router.push("/welcome");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h1
          className="text-xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sign Up
        </motion.h1>

        <motion.form
          onSubmit={handleSignup}
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-200"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-200"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </motion.form>

        <motion.p
          className="text-sm mt-4 text-center text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 underline">
            Log in here
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
