import { NextResponse } from "next/server";
import { z } from "zod";
import querystring from "node:querystring";
import { VercelKV } from "@vercel/kv";
import type { SpotifyResponse } from "@/types/spotify";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const kvRestApiUrl = process.env.KV_REST_API_URL;
const kvRestApiToken = process.env.KV_REST_API_TOKEN;

const isConfigured =
  clientId && clientSecret && refreshToken && kvRestApiUrl && kvRestApiToken;

let redis: VercelKV | null = null;

if (isConfigured) {
  try {
    redis = new VercelKV({
      url: kvRestApiUrl,
      token: kvRestApiToken,
    });
  } catch (error) {
    console.error("Error initializing VercelKV:", error);
  }
} else {
  console.warn("Spotify environment variables are not properly configured.");
}

const basicToken = isConfigured
  ? Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  : null;

const getAccessToken = async () => {
  if (!isConfigured || !basicToken) {
    console.warn("Missing Spotify configuration for getAccessToken.");
    return null;
  }

  try {
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

    if (!response.ok) {
      console.error(
        "Failed to get access token:",
        response.status,
        response.statusText
      );
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

const getLastSong = async (): Promise<SpotifyResponse> => {
  if (!redis) {
    return { isListening: false, name: null };
  }
  try {
    const lastSpotifySong = (await redis.get("last-spotify-song")) as
      | SpotifyResponse
      | undefined;

    if (lastSpotifySong) {
      return { ...lastSpotifySong, isListening: false } as SpotifyResponse;
    }
  } catch (error) {
    console.error("Error getting last song from Redis:", error);
  }
  return { isListening: false, name: null };
};

const getSpotifyStatus = async (): Promise<SpotifyResponse> => {
  if (!isConfigured) {
    return {
      isListening: false,
      name: null,
    };
  }
  let errored = false;
  const accessTokenResponse = await getAccessToken();
  const accessToken = accessTokenResponse?.access_token;

  if (!accessToken) {
    return getLastSong();
  }

  try {
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

    if (redis) {
      await redis.set("last-spotify-song", spotifyStatus).catch(console.error);
    }
    return spotifyStatus;
  } catch (error) {
    console.error("Error fetching Spotify status:", error);
    return getLastSong();
  }
};

export async function GET() {
  if (!isConfigured) {
    return NextResponse.json({ isListening: false, name: null });
  }

  if (!redis) {
    return NextResponse.json({ isListening: false, name: null });
  }

  try {
    const cached = await redis.get("spotify-cache");

    if (cached) {
      return NextResponse.json(cached);
    }

    const spotifyStatus = await getSpotifyStatus();
    await redis.setex("spotify-cache", 30, spotifyStatus).catch(console.error);

    return NextResponse.json(spotifyStatus);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ isListening: false, name: null });
  }
}
