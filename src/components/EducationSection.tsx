import { education } from "@/data/portfolio";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function EducationSection() {
  return (
    <section id="education" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading eyebrow="Education" title="Academic foundation" />

        <div className="grid gap-5 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 90} className="h-full">
              <article className="card card-hover h-full p-6 sm:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Icon name="cap" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-fg">{e.degree}</h3>
                <p className="mt-1.5 font-medium text-accent">{e.institution}</p>
                <p className="mt-1 text-sm text-muted">{e.detail}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 font-mono text-xs">
                  <span className="text-fg">{e.period}</span>
                  <span className="text-ok">{e.status}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
