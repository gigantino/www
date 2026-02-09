"use client";

import { newsletter } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { useEffect, useState } from "react";
import { CircleCheck, CircleAlert } from "lucide-react";

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
    <BentoCard id="newsletter" className="relative flex flex-col gap-4 bg-pink-200">
      {/* NEW!! Starburst Badge */}
      <div className="absolute -top-6 -right-6 rotate-12">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <path
            d="M50 0 L59 16 L75 7 L75 25 L93 25 L84 41 L100 50 L84 59 L93 75 L75 75 L75 93 L59 84 L50 100 L41 84 L25 93 L25 75 L7 75 L16 59 L0 50 L16 41 L7 25 L25 25 L25 7 L41 16 Z"
            className="fill-yellow-100 stroke-gray-800"
            strokeWidth="3"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold">
          NEW
        </span>
      </div>
      <h2 className="text-xl font-bold">Newsletter</h2>
      <p className="text-sm">{newsletter.description}</p>
      {message ? (
        <div className={`neo-card px-3 py-2 text-sm flex items-center gap-2 ${message.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.success ? <CircleCheck className="size-4 shrink-0" /> : <CircleAlert className="size-4 shrink-0" />}
          <span className="flex-1">{message.text}</span>
          {!message.success && (
            <button onClick={() => setMessage(null)} className="shrink-0 font-bold text-sm underline">
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
            className="neo-card min-w-0 flex-1 bg-emerald-100 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="neo-button shrink-0 bg-yellow-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Subscribe
          </button>
        </form>
      )}
    </BentoCard>
  );
}
