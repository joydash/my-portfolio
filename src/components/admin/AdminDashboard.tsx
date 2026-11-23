"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastProvider } from "@/components/Toast";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import BlogsManager from "./BlogsManager";
import ProjectsManager from "./ProjectsManager";
import { btnGhost } from "./ui";

type Tab = "projects" | "blogs";

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");

  async function signOut() {
    await getBrowserSupabase().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <ToastProvider>
      <div className="wrap py-6 sm:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{"//"} admin</p>
            <h1 className="text-2xl font-semibold text-fg">Content manager</h1>
            <p className="text-xs text-muted">Signed in as {email}</p>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={btnGhost}>
              View site
            </a>
            <button type="button" onClick={signOut} className={btnGhost}>
              Sign out
            </button>
          </div>
        </header>

        <div role="tablist" aria-label="Admin sections" className="mb-6 flex gap-2 border-b border-line">
          {(
            [
              ["projects", "Manage Projects"],
              ["blogs", "Manage Blogs"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`-mb-px min-h-11 border-b-2 px-4 text-sm font-medium transition ${
                tab === id ? "border-accent text-accent" : "border-transparent text-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "projects" ? <ProjectsManager /> : <BlogsManager />}
      </div>
    </ToastProvider>
  );
}
