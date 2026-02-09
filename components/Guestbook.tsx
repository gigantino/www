"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Github, Pencil } from "lucide-react";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isAccountOldEnough(githubCreatedAt: string | undefined): boolean {
  if (!githubCreatedAt) return false;
  const createdAt = new Date(githubCreatedAt);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return createdAt <= sixMonthsAgo;
}

type GuestbookData = {
  entries: {
    _id: string;
    _creationTime: number;
    message: string;
    name: string;
    image?: string;
    githubUsername?: string;
  }[];
  page: number;
  totalPages: number;
  totalEntries: number;
};

export function Guestbook({ initialData }: { initialData: GuestbookData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);

  const { signIn, signOut } = useAuthActions();
  const currentUser = useQuery(api.guestbook.currentUser);
  const myEntry = useQuery(api.guestbook.myEntry);
  const guestbookDataLive = useQuery(api.guestbook.list, { page, pageSize: 5 });
  const prevDataRef = useRef<GuestbookData>(initialData);
  if (guestbookDataLive !== undefined) {
    prevDataRef.current = guestbookDataLive;
  }
  const guestbookData = guestbookDataLive ?? prevDataRef.current;
  const sign = useMutation(api.guestbook.sign);

  const isEditing = myEntry !== null && myEntry !== undefined;
  const messageChanged = !isEditing || message !== myEntry?.message;

  // Auto-open from ?guestbook=1 query param (after OAuth redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("guestbook") === "1") {
      setIsOpen(true);
      params.delete("guestbook");
      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-guestbook", handleOpen);
    return () => window.removeEventListener("open-guestbook", handleOpen);
  }, []);

  useEffect(() => {
    if (myEntry?.message && message === "") {
      setMessage(myEntry.message);
    }
  }, [myEntry, message]);

  // Reset page when modal opens
  useEffect(() => {
    if (isOpen) setPage(1);
  }, [isOpen]);

  // Scroll entries to top on page change
  useEffect(() => {
    entriesRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Focus textarea when modal opens and user is eligible
  useEffect(() => {
    if (isOpen && currentUser && isAccountOldEnough(currentUser.githubCreatedAt)) {
      // Small delay to ensure DOM is ready
      const t = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, currentUser]);

  const handleSignIn = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("guestbook", "1");
    void signIn("github", { redirectTo: url.toString() });
  };

  const handleSignOut = () => {
    void signOut();
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await sign({ message });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const eligible = isAccountOldEnough(currentUser?.githubCreatedAt);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Guestbook"
      className="bg-amber-100"
    >
      {/* Auth / Form Section */}
      {currentUser === undefined ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : currentUser === null ? (
        <button
          onClick={handleSignIn}
          className="neo-button !bg-gray-800 !text-white text-sm flex w-full items-center justify-center gap-2"
        >
          <Github size={16} />
          Sign in with GitHub
        </button>
      ) : (
        <>
          {/* User info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {currentUser.image && (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name ?? "User"}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-gray-800"
                />
              )}
              <div>
                <span className="text-sm font-medium">
                  {currentUser.name}
                </span>
                {currentUser.githubUsername && (
                  <span className="text-xs text-gray-500 ml-1">
                    @{currentUser.githubUsername}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 text-xs text-gray-500 underline hover:text-gray-700"
            >
              Sign out
            </button>
          </div>

          {/* Account age warning */}
          {!eligible ? (
            <div className="neo-card bg-red-100 p-3 text-sm text-red-800">
              Your GitHub account must be at least 6 months old to sign the
              guestbook. This helps prevent spam.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setMessage(e.target.value);
                      setError("");
                    }
                  }}
                  placeholder="Leave a message..."
                  rows={3}
                  required
                  className="neo-card w-full resize-none bg-white px-3 py-2 text-sm outline-none"
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {message.length}/200
                </span>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || message.trim().length === 0 || !messageChanged}
                className="neo-button self-start bg-lime-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  "Saving..."
                ) : isEditing ? (
                  <>
                    <Pencil size={14} />
                    Edit Message
                  </>
                ) : (
                  "Sign Guestbook"
                )}
              </button>
            </form>
          )}
        </>
      )}

      {/* Messages */}
      <div ref={entriesRef} className="flex flex-col gap-3 pt-4">
        {guestbookData.entries.length === 0 ? (
          <div className="text-sm text-gray-500">
            No entries yet. Be the first to sign!
          </div>
        ) : (
          <>
            {guestbookData.entries.map((entry) => (
              <div key={entry._id} className="neo-card bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {entry.image && (
                      <Image
                        src={entry.image}
                        alt={entry.name}
                        width={24}
                        height={24}
                        className="rounded-full border-2 border-gray-800"
                      />
                    )}
                    {entry.githubUsername ? (
                      <a
                        href={`https://github.com/${entry.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm hover:underline"
                      >
                        {entry.name}
                      </a>
                    ) : (
                      <span className="font-medium text-sm">{entry.name}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(entry._creationTime)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{entry.message}</p>
              </div>
            ))}
            {guestbookData.totalPages > 1 && (
              <PaginationControls
                page={guestbookData.page}
                totalPages={guestbookData.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
