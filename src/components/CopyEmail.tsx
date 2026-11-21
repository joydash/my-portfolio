"use client";

import { useState } from "react";
import { site } from "@/data/portfolio";
import { copyText } from "@/lib/clipboard";
import Icon from "./Icon";
import { useToast } from "./Toast";

export default function CopyEmail({
  variant = "button",
  className = "",
}: {
  variant?: "button" | "ghost";
  className?: string;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const ok = await copyText(site.email);
    if (ok) {
      setCopied(true);
      toast(`Email copied: ${site.email}`);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast("Couldn't copy automatically — use the mail link instead.", "error");
    }
  }

  const base =
    variant === "button"
      ? "inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white/[0.03] px-4 text-sm font-medium text-fg transition hover:border-accent/50 hover:bg-white/[0.06]"
      : "inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-muted transition hover:text-fg";

  return (
    <button type="button" onClick={onCopy} className={`${base} ${className}`}>
      <Icon name={copied ? "check" : "copy"} className="h-4 w-4 text-accent" />
      <span className="font-mono">{copied ? "Copied!" : site.email}</span>
      <span className="sr-only">Copy email address to clipboard</span>
    </button>
  );
}
