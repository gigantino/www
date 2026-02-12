"use client";

import { newsletter } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { useEffect, useState } from "react";
import { CircleCheck, CircleAlert, Send, Mail } from "lucide-react";

const newBadge = (
  <div className="absolute -top-8 -right-8">
    <div className="w-26 h-26 animate-spin" style={{ animationDuration: "20s" }}>
      <svg viewBox="-3 -3 106 106" className="w-full h-full">
        <path
          d="M50 0 L59.9 19.6 L79.4 9.5 L75.9 31.2 L97.6 34.5 L82 50 L97.6 65.5 L75.9 68.8 L79.4 90.5 L59.9 80.4 L50 100 L40.1 80.4 L20.6 90.5 L24.1 68.8 L2.4 65.5 L18 50 L2.4 34.5 L24.1 31.2 L20.6 9.5 L40.1 19.6 Z"
          className="fill-yellow-100 stroke-gray-800 dark:fill-gray-700 dark:stroke-gray-500"
          strokeWidth="3"
        />
      </svg>
    </div>
    <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold rotate-[20deg] dark:text-gray-200">
      NEW
    </span>
  </div>
);

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage({ text: data.message, success: data.success });
      if (data.success) setEmail("");
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", success: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <BentoCard id="newsletter" className="relative flex flex-col gap-4 bg-pink-200 dark:bg-gray-800">
      {newBadge}
      <h2 className="text-xl font-bold flex items-center gap-2 dark:text-gray-100"><Mail className="size-5" /> Newsletter</h2>
      <p className="text-base dark:text-gray-300">{newsletter.description}</p>
      {message ? (
        <div className={`neo-card px-3 py-2 text-sm flex items-center gap-2 ${message.success ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>
          {message.success ? <CircleCheck className="size-4 shrink-0" /> : <CircleAlert className="size-4 shrink-0" />}
          <span className="flex-1">{message.text}</span>
          {!message.success && (
            <button onClick={() => setMessage(null)} className="shrink-0 font-bold text-sm underline dark:text-red-300">
              Try again
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="neo-card min-w-0 flex-1 bg-emerald-100 px-3 py-2 text-base outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="neo-button shrink-0 bg-yellow-100 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 dark:bg-gray-600 dark:text-gray-100"
          >
            <Send className="size-4" /> Subscribe
          </button>
        </form>
      )}
    </BentoCard>
  );
}
