import type { APIRoute } from "astro";
import { z } from "zod";
import querystring from "node:querystring";

const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

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

type SpotifyResponse =
  | {
      isListening: true;
      href: string;
      name: string;
      thumbnailUrl: string;
      artists: {
        name: string;
        href: string;
      }[];
    }
  | {
      isListening: false;
    };

export const getSpotifyStatus = async (): Promise<SpotifyResponse> => {
  let errored = false;
  const { access_token: accessToken } = await getAccessToken().catch(
    () => (errored = true)
  );
  if (errored) {
    return { isListening: false };
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok || response.status == 204) {
    return {
      isListening: false,
    };
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
          href: z.string(),
        })
        .array(),
    }),
    currently_playing_type: z.literal("track"),
    is_playing: z.boolean(),
  });

  const dataValidation = spotifySchema.safeParse(data);
  if (!dataValidation.success) {
    return {
      isListening: false,
    };
  }

  const { data: parsedData } = dataValidation;

  return {
    isListening: true,
    href: parsedData.item.external_urls.spotify,
    name: parsedData.item.name,
    thumbnailUrl: parsedData.item.album.images[1].url,
    artists: parsedData.item.artists,
  };
};

export const get: APIRoute = async ({ params, request }) => {
  const spotifyStatus = await getSpotifyStatus();

  return {
    body: JSON.stringify(spotifyStatus),
  };
};