"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { projectFilters, projects, type Project } from "@/data/portfolio";
import Icon from "./Icon";
import Modal from "./Modal";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Filter = (typeof projectFilters)[number]["id"];

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-accent">{label}</p>
      <div className="mt-1.5 text-sm leading-relaxed text-fg/90">{children}</div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = useMemo(
    () => projects.filter((p) => filter === "all" || p.category === filter),
    [filter],
  );
  const active: Project | null = projects.find((p) => p.id === activeId) ?? null;
  const close = useCallback(() => setActiveId(null), []);

  return (
    <section id="projects" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Case studies: Challenge → Architecture → Operational impact"
          description="Hands-on network and infrastructure builds. Open any card for architecture notes."
        />

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {projectFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`min-h-11 rounded-lg border px-4 text-sm font-medium transition ${
                filter === f.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-muted hover:border-accent/40 hover:text-fg"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {visible.map((p) => (
            <Reveal key={p.id} className="h-full">
              <article className="card card-hover flex h-full flex-col p-6">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    width={800}
                    height={450}
                    className="mb-5 h-auto w-full rounded-lg border border-line"
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-md bg-accent/10 px-2 py-1 font-mono text-[11px] text-accent">
                    {p.category === "network" ? "NETWORK DESIGN" : "SYSTEMS & SECURITY"}
                  </span>
                  <span className="font-mono text-xs text-muted">{p.period}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-fg">{p.title}</h3>
                {p.org && <p className="mt-1 text-xs text-muted">{p.org}</p>}

                <div className="mt-5 space-y-4">
                  <Block label="Challenge">{p.challenge}</Block>
                  <Block label="Architecture & Stack">
                    <p>{p.architecture}</p>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 6).map((s) => (
                        <li
                          key={s}
                          className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-muted"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Block>
                  <Block label="Operational Impact">{p.impact}</Block>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveId(p.id)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent/10 px-4 text-sm font-semibold text-accent transition hover:bg-accent/20"
                  >
                    Architecture notes
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </button>
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line px-4 text-sm text-fg transition hover:border-accent/50"
                    >
                      Live <Icon name="external" className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line px-4 text-sm text-fg transition hover:border-accent/50"
                    >
                      <Icon name="github" className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          More case studies are added as projects complete.
        </p>
      </div>

      <Modal
        open={active !== null}
        onClose={close}
        title={active?.title ?? ""}
        eyebrow={active ? `${active.period}${active.org ? ` · ${active.org}` : ""}` : undefined}
      >
        {active && (
          <div className="space-y-6">
            <Block label="Challenge">{active.challenge}</Block>
            <Block label="Architecture">{active.architecture}</Block>
            <Block label="Technical notes">
              <ul className="space-y-2">
                {active.notes.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-sm bg-ok" aria-hidden="true" />
                    {n}
                  </li>
                ))}
              </ul>
            </Block>
            <Block label="Stack">
              <ul className="flex flex-wrap gap-1.5">
                {active.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-line bg-white/[0.03] px-2 py-1 font-mono text-xs text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
            <Block label="Operational impact">{active.impact}</Block>
          </div>
        )}
      </Modal>
    </section>
  );
}
