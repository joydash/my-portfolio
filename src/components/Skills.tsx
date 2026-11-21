import { skillGroups } from "@/data/portfolio";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="Technology & Infrastructure Matrix"
          title="Organised by enterprise domain"
          description="Tools and protocols I work with, grouped by the problems they solve."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 80} className="h-full">
              <article className="card card-hover h-full p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold text-fg">{g.title}</h3>
                  <span className="font-mono text-xs text-ok">
                    {String(g.items.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted">{g.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md border border-line bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-fg/90"
                    >
                      {it}
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
