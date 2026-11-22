import { education } from "@/data/portfolio";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function EducationSection() {
  return (
    <section id="education" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <SectionHeading eyebrow="Education" title="Academic foundation" />

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={(i % 2) * 90} className="h-full">
              <article className="card card-hover h-full p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon name="cap" className="h-6 w-6" />
                  </span>
                  <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {e.level}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-fg">{e.degree}</h3>
                <p className="mt-1.5 font-medium text-accent">{e.institution}</p>
                <p className="mt-1 text-sm text-muted">{e.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
