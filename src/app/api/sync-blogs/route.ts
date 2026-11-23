import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { FEEDS } from "@/lib/feeds";
import { fetchFeed, type FeedResult } from "@/lib/rss";
import { createServiceClient } from "@/lib/supabase/service";
import type { NewAutoBlog } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; `x-cron-secret` is accepted for manual calls. */
function hasCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const header = req.headers.get("x-cron-secret") ?? "";
  return (bearer !== "" && safeEqual(bearer, secret)) || (header !== "" && safeEqual(header, secret));
}

async function run(req: NextRequest) {
  const authorized = hasCronSecret(req) || (await getAdminUser()) !== null;
  if (!authorized) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const db = createServiceClient();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 },
    );
  }

  const settled = await Promise.all(FEEDS.map((f) => fetchFeed(f)));
  const feeds: FeedResult[] = settled.map((s) => s.result);

  // de-dupe by external_url inside this batch, otherwise one upsert statement could hit the same key twice
  const byUrl = new Map<string, NewAutoBlog>();
  for (const { items } of settled) for (const item of items) if (!byUrl.has(item.external_url)) byUrl.set(item.external_url, item);
  const rows = [...byUrl.values()];

  let inserted = 0;
  if (rows.length > 0) {
    // ignoreDuplicates keeps existing rows untouched, so an admin's edits/unpublish choices survive re-syncs
    const { data, error } = await db
      .from("blogs")
      .upsert(rows, { onConflict: "external_url", ignoreDuplicates: true })
      .select("id");
    if (error) {
      return NextResponse.json({ ok: false, error: error.message, feeds }, { status: 500 });
    }
    inserted = data?.length ?? 0;
  }

  if (inserted > 0) {
    revalidatePath("/");
    revalidatePath("/blog");
  }

  return NextResponse.json({
    ok: true,
    inserted,
    skipped: rows.length - inserted,
    fetched: rows.length,
    feeds,
  });
}

/** Vercel Cron issues GET requests. */
export async function GET(req: NextRequest) {
  return run(req);
}

/** The admin dashboard button issues POST (cookie session). */
export async function POST(req: NextRequest) {
  return run(req);
}
