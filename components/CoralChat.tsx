"use client";

import { useEffect, useRef, useState } from "react";
import { Send, RotateCw, Loader2, TriangleAlert } from "lucide-react";

interface ChatMessage {
  username: string;
  message: string;
  colorClass: string;
}

const MC_COLORS = [
  "text-red-600 dark:text-red-400",
  "text-amber-600 dark:text-amber-400",
  "text-yellow-600 dark:text-yellow-400",
  "text-green-600 dark:text-green-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-blue-600 dark:text-blue-400",
  "text-purple-600 dark:text-purple-400",
  "text-gray-500 dark:text-gray-400",
] as const;

function hashUsername(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return MC_COLORS[Math.abs(hash) % MC_COLORS.length];
}

const RE_USERNAME = /<span[^>]*>\[([^\]]+)\]<\/span>/;
const RE_MESSAGE = /<\/span>:\s*<span>([^<]*)<\/span>/;

function parseSSEMessage(
  html: string,
): { username: string; message: string } | null {
  const usernameMatch = html.match(RE_USERNAME);
  const messageMatch = html.match(RE_MESSAGE);
  if (!usernameMatch || !messageMatch) return null;
  return { username: usernameMatch[1], message: messageMatch[1] };
}

const API_URL = "/api/coral-chat";

export function CoralChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState("Steve");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function generate(userMsg?: { username: string; message: string }) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const history = messages.map((m) => ({
      username: m.username,
      message: m.message,
    }));

    const body = userMsg
      ? {
          history,
          last_message: userMsg,
          seed: Math.floor(Math.random() * 100000),
        }
      : {
          history: history.slice(0, -1),
          last_message: history[history.length - 1],
          seed: Math.floor(Math.random() * 100000),
        };

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          let eventType = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7);
            if (line.startsWith("data: ")) data = line.slice(6);
          }

          if (eventType === "done") break;
          if (eventType === "message" && data) {
            const parsed = parseSSEMessage(data);
            if (parsed) {
              setMessages((prev) => [
                ...prev,
                {
                  username: parsed.username,
                  message: parsed.message,
                  colorClass: hashUsername(parsed.username),
                },
              ]);
            }
          }
        }
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || !username.trim() || loading) return;

    const userMsg = { username: username.trim(), message: trimmed };
    setMessages((prev) => [
      ...prev,
      {
        username: userMsg.username,
        message: userMsg.message,
        colorClass: hashUsername(userMsg.username),
      },
    ]);
    setInput("");
    generate(userMsg);
  }

  function handleContinue() {
    if (loading || messages.length === 0) return;
    generate();
  }

  return (
    <div className="neo-card bg-orange-50 dark:bg-gray-800 dark:border-gray-600 dark:shadow-[4px_4px_0_theme(colors.gray.700)] p-4 sm:p-6 not-prose">
      <div className="mb-3 flex items-center gap-2 border-2 border-gray-800 bg-amber-100 px-4 py-3 text-sm font-medium text-gray-800 shadow-[4px_4px_0_theme(colors.gray.800)] dark:border-gray-600 dark:bg-amber-900/50 dark:text-amber-200 dark:shadow-[4px_4px_0_theme(colors.gray.600)]">
        <TriangleAlert className="size-4 shrink-0" />
        Early preview. The final model will behave differently.
      </div>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16),
              )
            }
            placeholder="Steve"
            className="neo-card w-full bg-white px-3 py-2 text-sm outline-none sm:w-32 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:shadow-[4px_4px_0_theme(colors.gray.700)] dark:placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleContinue}
          disabled={loading || messages.length === 0}
          className="neo-button hidden sm:flex bg-sky-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-1 dark:bg-gray-600 dark:text-gray-100"
        >
          <RotateCw className="size-3.5" /> Continue Chat
        </button>
      </div>
      <div
        ref={chatRef}
        className="neo-card h-64 sm:h-80 overflow-y-auto bg-white p-3 sm:p-4 dark:bg-gray-900 dark:border-gray-600 dark:shadow-[4px_4px_0_theme(colors.gray.700)]"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Send a message to start chatting with CoralGPT...
          </p>
        ) : null}
        {messages.map((msg, i) => (
          <div key={i} className="text-sm leading-relaxed">
            <span className={`font-bold ${msg.colorClass}`}>
              [{msg.username}]
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              : {msg.message}
            </span>
          </div>
        ))}
        {loading ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
            <Loader2 className="size-3.5 animate-spin" />
            Generating...
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex gap-2 sm:items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={100}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type a message..."
            disabled={loading}
            className="neo-card min-w-0 flex-1 bg-white px-3 py-2 text-sm outline-none disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:shadow-[4px_4px_0_theme(colors.gray.700)] dark:placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || !username.trim()}
            className="neo-button hidden sm:flex shrink-0 bg-emerald-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-1 dark:bg-gray-600 dark:text-gray-100"
          >
            <Send className="size-3.5" /> Send
          </button>
        </div>

        <div className="flex gap-2 sm:hidden">
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || !username.trim()}
            className="neo-button flex-1 bg-emerald-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 dark:bg-gray-600 dark:text-gray-100"
          >
            <Send className="size-3.5" /> Send
          </button>
          <button
            onClick={handleContinue}
            disabled={loading || messages.length === 0}
            className="neo-button flex-1 bg-sky-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 dark:bg-gray-600 dark:text-gray-100"
          >
            <RotateCw className="size-3.5" /> Continue
          </button>
        </div>
      </div>
    </div>
  );
}
