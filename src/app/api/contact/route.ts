import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail(400, "Invalid request.");
  }

  // Honeypot: real visitors never fill this hidden field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? oneLine(body.name) : "";
  const email = typeof body.email === "string" ? oneLine(body.email) : "";
  const subject = typeof body.subject === "string" ? oneLine(body.subject) : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 100) return fail(400, "Please enter your name.");
  if (!EMAIL_RE.test(email) || email.length > 200)
    return fail(400, "Please enter a valid email address.");
  if (subject.length > 150) return fail(400, "Subject is too long.");
  if (message.length < 10 || message.length > 5000)
    return fail(400, "Message must be between 10 and 5000 characters.");

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return fail(429, "Too many messages. Please try again in a few minutes.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL ?? "info@joydash.me";
  const from = process.env.CONTACT_FROM ?? "Portfolio Contact <noreply@joydash.me>";

  if (!apiKey) {
    return fail(503, "The contact form is not configured yet. Please email info@joydash.me directly.");
  }

  const finalSubject = `[joydash.me] ${subject || `Message from ${name}`}`;
  const text = `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "(none)"}\n\n${message}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;color:#0f172a">
      <h2 style="margin:0 0 12px;color:#0369a1">New portfolio message</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(subject || "(none)")}</p>
      <div style="white-space:pre-wrap;border-left:3px solid #38bdf8;padding:8px 14px;background:#f1f5f9">${escapeHtml(message)}</div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: finalSubject,
      text,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return fail(502, "Could not send your message right now. Please email info@joydash.me directly.");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route failure:", err);
    return fail(500, "Something went wrong. Please email info@joydash.me directly.");
  }
}
