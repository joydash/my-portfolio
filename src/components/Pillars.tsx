import { pillars } from "@/data/portfolio";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Pillars() {
  return (
    <section id="pillars" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <SectionHeading
          eyebrow="Core Engineering Pillars"
          title="What I bring to a Bank IT team"
          description="Three disciplines that keep critical connectivity available, observable and auditable."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="h-full">
              <article className="card card-hover relative flex h-full flex-col overflow-hidden p-6">
                <span
                  className="pointer-events-none absolute -right-3 -top-4 font-mono text-7xl font-bold text-white/[0.03]"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-fg">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</p>
                <ul className="mt-5 space-y-2.5 text-sm text-fg/90">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-ok" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-2 pt-1">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-accent"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
