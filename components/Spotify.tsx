"use client";

import { useEffect, useState } from "react";
import type { SpotifyResponse } from "@/types/spotify";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Spotify() {
  const [data, setData] = useState<SpotifyResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/spotify");
      const json = await res.json();
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <motion.div
      key="spotify"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="not-prose"
    >
      <div className="relative w-full">
        {isLoading && (
          <>
            <div className="absolute h-full w-full rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 transition-opacity duration-250" />
            <div className="absolute h-full w-full rounded border animate-pulse-fast dark:border-zinc-700 transition-opacity duration-250">
              <div className="h-full w-full rounded bg-zinc-100 dark:bg-zinc-950" />
            </div>
          </>
        )}

        <div className="rounded border p-3 dark:border-zinc-700">
          <div className="h-16">
            {data && data.isListening && data.name ? (
              <div className="flex h-full w-full gap-4">
                <div className="w-16 flex-shrink-0 rounded-md">
                  <Image
                    src={data.thumbnailUrl}
                    alt={data.name}
                    width={64}
                    height={64}
                    className="aspect-square w-full rounded-md"
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
                <div className="flex w-full flex-col justify-center overflow-hidden text-zinc-700 dark:text-white">
                  <a
                    className="w-fit truncate font-bold hover:underline"
                    href={data.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.name}
                  </a>
                  <span className="text-xs">{data.artists[0].name}</span>
                </div>
              </div>
            ) : (
              !isLoading && (
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Not currently listening to anything on Spotify.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
