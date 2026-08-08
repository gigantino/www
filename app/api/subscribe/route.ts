import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
  subscribeRequestSchema,
  subscribeResponseSchema,
} from "@/lib/schemas/newsletter";
import { publicEnv } from "@/lib/env.public";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const convex = new ConvexHttpClient(publicEnv.NEXT_PUBLIC_CONVEX_URL);
  try {
    const body: unknown = await req.json().catch(() => undefined);
    const parsedBody = subscribeRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedBody.error.issues[0]?.message ?? "Invalid request.",
        },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const result = await convex.mutation(api.subscribers.subscribe, {
      email: parsedBody.data.email,
      ip,
    });

    return NextResponse.json(subscribeResponseSchema.parse(result));
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
