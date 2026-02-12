import { NextRequest } from "next/server";

const UPSTREAM = "https://coralgpt.afkara.dev/chat-stream";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(UPSTREAM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
