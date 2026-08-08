import { coralChatRequestSchema } from "@/lib/schemas/coral-chat";
import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://coralgpt.afkara.dev/chat-stream";

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => undefined);
  const parsedBody = coralChatRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid chat request.",
        message: parsedBody.error.issues[0]?.message ?? "Invalid request.",
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(UPSTREAM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedBody.data),
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
