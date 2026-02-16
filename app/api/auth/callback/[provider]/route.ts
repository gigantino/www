import { NextRequest } from "next/server";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(request.url);

  const convexUrl = `${CONVEX_SITE_URL}/api/auth/callback/${provider}${url.search}`;

  // Forward cookies from the browser to Convex (OAuth state, PKCE cookies)
  const cookieHeader = request.headers.get("cookie");

  const response = await fetch(convexUrl, {
    redirect: "manual",
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });

  const headers = new Headers();

  // Relay Set-Cookie headers (cookie cleanup)
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
