"use client";
import { motion } from "framer-motion";

export default function SpotifySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 rounded border p-3 dark:border-zinc-700 animate-pulse-fast"
    >
      <div className="h-full w-full rounded bg-zinc-100 dark:bg-zinc-950" />
    </motion.div>
  );
}
