"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col text-gray-800 dark:text-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">NewsDash</h1>

        {session ? (
          <div className="space-y-3 text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="/dashboard"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-1000"
              >
                Go to Dashboard
              </a>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          Welcome to NewsDash 📰
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-6">
          Monitor articles and blog stats, calculate payouts, and export your insights — all in one responsive dashboard.
        </p>

        {session ? (
          <p className="text-green-600 font-semibold">
            You're signed in as {session.user?.email}
          </p>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        )}
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-gray-800 py-12 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          <div className="shadow rounded p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">News & Blogs</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Fetch and filter data from News API.
            </p>
          </div>
          <div className="shadow rounded p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Payout Calculator</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Admins can manage and calculate payouts.
            </p>
          </div>
          <div className="shadow rounded p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Export Reports</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Export data to CSV, PDF, and Google Sheets.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} NewsDash. Built with 💙 by Priyanka.
      </footer>
    </main>
  );
}
