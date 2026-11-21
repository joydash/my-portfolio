"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/portfolio";
import Icon from "./Icon";
import { useToast } from "./Toast";

type Status = "idle" | "sending" | "error";

const inputCls =
  "mt-1.5 w-full min-h-11 rounded-lg border border-line bg-ink/70 px-4 py-2.5 text-sm text-fg placeholder:text-muted/60 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function ContactForm() {
  const toast = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Could not send your message.");
      }
      form.reset();
      setStatus("idle");
      toast("Message sent — I'll reply to you by email.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : `Could not send your message. Please email ${site.email}.`;
      setError(msg);
      setStatus("error");
      toast("Message not sent.", "error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-7" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="text-sm font-medium text-fg">
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Your full name"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="text-sm font-medium text-fg">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@company.com"
            className={inputCls}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-subject" className="text-sm font-medium text-fg">
          Subject <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          maxLength={150}
          placeholder="e.g. Network Engineer opportunity"
          className={inputCls}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className="text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Tell me about the role or team…"
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            Email {site.email}
          </a>
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 font-semibold text-ink transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          <Icon name="send" className="h-4 w-4" />
        </button>
        <p className="text-xs text-muted">Delivered securely to {site.email}</p>
      </div>
    </form>
  );
}
