"use client";

import { newsletter } from "@/lib/data";
import { SendDoodle, MailDoodle } from "@/components/icons";
import { subscribeResponseSchema } from "@/lib/schemas/newsletter";
import { BentoCard } from "@/components/ui/BentoCard";
import { useEffect, useState } from "react";
import { CircleCheck, CircleAlert } from "lucide-react";
import { HandText } from "@/components/HandText";

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
      const data = subscribeResponseSchema.parse(await res.json());
      setMessage({ text: data.message, success: data.success });
      if (data.success) setEmail("");
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", success: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <BentoCard id="newsletter" className="flex flex-col gap-4 bg-amber-100">
      <h2 className="text-xl font-bold flex items-center gap-2"><MailDoodle size={20} /> <HandText text="Newsletter" /></h2>
      <p className="text-base">{newsletter.description}</p>
      {message ? (
        <div className={`neo-card px-3 py-2 text-sm flex items-center gap-2 ${message.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.success ? <CircleCheck className="size-4 shrink-0" /> : <CircleAlert className="size-4 shrink-0" />}
          <span className="flex-1">{message.text}</span>
          {!message.success && (
            <button onClick={() => setMessage(null)} className="neo-link shrink-0 font-bold text-sm">
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
            className="neo-card min-w-0 flex-1 bg-emerald-100 px-3 py-2 text-base outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="neo-button shrink-0 bg-yellow-100 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <SendDoodle size={16} /> Subscribe
          </button>
        </form>
      )}
    </BentoCard>
  );
}
