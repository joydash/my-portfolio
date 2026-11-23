"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site } from "@/data/portfolio";
import Icon from "./Icon";

const BLOG_LINK = { id: "blog", label: "Blog", href: "/blog" } as const;

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const items = [
    ...navLinks.map((l) => ({ id: l.id, label: l.label, href: `/#${l.id}` })),
    BLOG_LINK,
  ];
  const isActive = (id: string) =>
    id === "blog" ? pathname.startsWith("/blog") : id === "projects" && pathname.startsWith("/projects") ? true : onHome && active === id;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Elevated style after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy
  useEffect(() => {
    if (!onHome) return;
    const ids = ["home", ...navLinks.map((l) => l.id)];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  // Drawer: Escape key, scroll lock, focus handling
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const toggle = toggleRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prevOverflow;
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 glass ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="wrap flex h-16 items-center justify-between gap-4"
      >
        <Link
          href="/"
          aria-label={`${site.name} — back to top`}
          className="group flex h-11 items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/40 bg-surface font-mono text-sm font-bold text-fg transition group-hover:border-accent">
            {site.initials}
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-widest text-muted sm:block">
            joydash<span className="text-accent">.me</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {items.map((l) => (
            <li key={l.id}>
              <Link
                href={l.href}
                aria-current={isActive(l.id) ? "true" : undefined}
                className={`relative inline-flex h-11 items-center px-2.5 text-[13px] transition-colors ${
                  isActive(l.id) ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-2.5 bottom-1.5 h-px bg-accent transition-opacity ${
                    isActive(l.id) ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.cvPath}
            download={site.cvDownloadName}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-ink transition hover:bg-sky-300"
          >
            <Icon name="download" className="h-4 w-4" />
            <span className="hidden sm:inline">Download CV</span>
            <span className="sm:hidden">CV</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="grid h-11 w-11 place-items-center rounded-lg border border-line text-fg transition hover:bg-white/5 xl:hidden"
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>

      {open && (
        <div className="fixed inset-0 top-0 z-[60] xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="fade-in absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
          />
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="slide-in absolute right-0 top-0 flex h-full w-[min(84vw,20rem)] flex-col border-l border-line bg-surface p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Navigation
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-fg"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {items.map((l, i) => (
                <li key={l.id}>
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    onClick={close}
                    className={`flex min-h-12 items-center justify-between rounded-lg px-3 text-base transition ${
                      isActive(l.id)
                        ? "bg-accent/10 text-accent"
                        : "text-fg hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                    <Icon name="arrow-right" className="h-4 w-4 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={site.cvPath}
              download={site.cvDownloadName}
              onClick={close}
              className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-ink"
            >
              <Icon name="download" className="h-4 w-4" />
              Download CV
            </a>
          </div>
        </div>
      )}
    </>
  );
}
