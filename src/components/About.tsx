import { about, highlights } from "@/data/portfolio";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <SectionHeading
          eyebrow="About"
          title="Reliability-first network engineering for mission-critical environments"
        />

        <div className="max-w-3xl space-y-5 leading-relaxed text-muted">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Readiness highlights">
          {highlights.map((h, i) => (
            <li key={h.title}>
              <Reveal delay={i * 70} className="h-full">
                <div className="card card-hover h-full p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Icon name={h.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-wide text-ok">
                      {h.stat}
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold text-fg">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
