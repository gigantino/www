"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";

const WHITESPACE_RE = /\s+/g;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  size = "lg",
  className = "",
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeClass = size === "md" ? "sm:max-w-lg" : "sm:max-w-[45rem]";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const t = setTimeout(() => modalRef.current?.focus(), 10);
    return () => {
      clearTimeout(t);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const titleId = `modal-title-${title.toLowerCase().replace(WHITESPACE_RE, "-")}`;

  return (
    <div
      ref={overlayRef}
      className="modal-backdrop fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`modal-panel neo-card relative flex h-full w-full flex-col outline-none max-sm:rounded-none max-sm:border-0 max-sm:shadow-none ${sizeClass} sm:h-auto sm:max-h-[85vh] sm:mx-4 ${className}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b-3 border-gray-800 px-6 py-4">
          <h2 id={titleId} className="text-xl font-bold flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="neo-button bg-white text-sm flex items-center gap-1"
            aria-label="Close"
          >
            ✕ Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
