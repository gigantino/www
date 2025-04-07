import Image from "next/image";
import type { SpotifyResponse } from "@/types/spotify";
import { ofetch } from "ofetch";

export default async function Spotify() {
  const data = await ofetch<SpotifyResponse>(
    "http://localhost:3000/api/spotify"
  );

  return (
    <div className="border p-3 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="h-16">
        {data && data.name ? (
          <div className="flex h-full w-full gap-4">
            <div className="w-16 flex-shrink-0 rounded-md">
              <Image
                src={data.thumbnailUrl}
                alt={data.name}
                width={64}
                height={64}
                className="aspect-square w-full rounded-md"
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
          <div className="text-sm text-zinc-500 dark:text-zinc-400 w-full h-full flex items-center justify-center">
            Couldn't fetch song.
          </div>
        )}
      </div>
    </div>
  );
}
