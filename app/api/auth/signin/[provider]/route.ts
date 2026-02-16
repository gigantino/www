import { NextRequest } from "next/server";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(request.url);

  const convexUrl = `${CONVEX_SITE_URL}/api/auth/signin/${provider}${url.search}`;

  const response = await fetch(convexUrl, { redirect: "manual" });

  const headers = new Headers();

  // Relay Set-Cookie headers (OAuth state, PKCE, redirect cookies)
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      headers.append("set-cookie", value);
    }
  }

  // Relay the redirect
  const location = response.headers.get("location");
  if (location) {
    headers.set("location", location);
  }

  return new Response(null, {
    status: response.status,
    headers,
  });
}
