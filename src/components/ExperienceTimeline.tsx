import Image from "next/image";
import { experience } from "@/data/portfolio";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="Experience"
          title="Career progression in ISP & enterprise network operations"
          description="From data center intern to Tier 2/3 support for corporate subscribers — each step deeper into production networks."
        />

        <ol className="relative ml-3 space-y-8 border-l border-line pl-8 sm:ml-4 sm:pl-10">
          <span
            className="absolute -left-px top-0 h-40 w-px bg-gradient-to-b from-accent to-transparent"
            aria-hidden="true"
          />
          {experience.map((job, i) => (
            <li key={job.id} className="relative">
              <span
                className={`absolute -left-[41px] top-7 grid h-5 w-5 place-items-center rounded-full border bg-ink sm:-left-[49px] ${
                  job.current ? "border-ok" : "border-accent/60"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`relative h-2 w-2 rounded-full ${
                    job.current ? "status-dot bg-ok" : "bg-accent"
                  }`}
                />
              </span>

              <Reveal delay={i * 60}>
                <article className="card card-hover p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-fg">{job.role}</h3>
                      <p className="mt-1 font-medium text-accent">{job.company}</p>
                      {job.companyNote && (
                        <p className="mt-0.5 text-xs text-muted">{job.companyNote}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end">
                      {job.logos && (
                        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5">
                          {job.logos.map((l) => (
                            <Image
                              key={l.src}
                              src={l.src}
                              alt={l.alt}
                              width={l.width}
                              height={l.height}
                              className="h-7 w-auto"
                            />
                          ))}
                        </div>
                      )}
                      <p className="font-mono text-xs text-muted">
                        <span className="text-fg">{job.period}</span>
                        {job.current && (
                          <span className="ml-2 rounded bg-ok/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ok">
                            Current
                          </span>
                        )}
                        <span className="mt-1 flex items-center gap-1 sm:justify-end">
                          <Icon name="pin" className="h-3 w-3" />
                          {job.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-fg/90">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-sm bg-accent"
                          aria-hidden="true"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
