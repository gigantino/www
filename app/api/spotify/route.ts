import { NextResponse } from "next/server";
import { z } from "zod";
import querystring from "node:querystring";
import { VercelKV } from "@vercel/kv";
import type { SpotifyResponse } from "@/types/spotify";

const redis = new VercelKV({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

const getAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return response.json();
};

const getLastSong = async (): Promise<SpotifyResponse> => {
  const lastSpotifySong = (await redis
    .get("last-spotify-song")
    .catch(console.error)) as SpotifyResponse;
  if (lastSpotifySong) {
    return { ...lastSpotifySong, isListening: false } as SpotifyResponse;
  }
  return { isListening: false, name: null };
};

const getSpotifyStatus = async (): Promise<SpotifyResponse> => {
  let errored = false;
  const { access_token: accessToken } =
    (await getAccessToken().catch(() => {
      errored = true;
    })) || {};

  if (errored || !accessToken) {
    return getLastSong();
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok || response.status === 204) {
    return getLastSong();
  }

  const data = await response.json();

  const spotifySchema = z.object({
    item: z.object({
      album: z.object({
        images: z
          .object({
            url: z.string(),
          })
          .array(),
      }),
      name: z.string(),
      external_urls: z.object({
        spotify: z.string(),
      }),
      artists: z
        .object({
          name: z.string(),
          external_urls: z.object({
            spotify: z.string(),
          }),
        })
        .array(),
    }),
    currently_playing_type: z.literal("track"),
    is_playing: z.boolean(),
  });

  const validation = spotifySchema.safeParse(data);
  if (!validation.success) {
    return getLastSong();
  }

  const parsed = validation.data;

  const spotifyStatus: SpotifyResponse = {
    isListening: true,
    href: parsed.item.external_urls.spotify,
    name: parsed.item.name,
    thumbnailUrl: parsed.item.album.images[1].url,
    artists: parsed.item.artists.map((artist) => ({
      name: artist.name,
      href: artist.external_urls.spotify,
    })),
  };

  await redis.set("last-spotify-song", spotifyStatus).catch(console.error);
  return spotifyStatus;
};

export async function GET() {
  const cached = await redis.get("spotify-cache").catch(console.error);

  if (cached) {
    return NextResponse.json(cached);
  }

  const spotifyStatus = await getSpotifyStatus();
  await redis.setex("spotify-cache", 30, spotifyStatus).catch(console.error);

  return NextResponse.json(spotifyStatus);
}
