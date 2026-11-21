import { certifications } from "@/data/portfolio";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="Licenses & Certifications"
          title="Vendor certification and completed courses"
          description="Credentials are listed on my LinkedIn profile."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => {
            const vendor = c.type === "Vendor certification";
            return (
              <Reveal key={c.title} delay={(i % 3) * 70} className="h-full">
                <article
                  className={`card card-hover flex h-full flex-col p-6 ${
                    vendor ? "border-ok/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-lg ${
                        vendor ? "bg-ok/15 text-ok" : "bg-accent/10 text-accent"
                      }`}
                    >
                      <Icon name="award" className="h-5 w-5" />
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        vendor ? "bg-ok/15 text-ok" : "bg-white/5 text-muted"
                      }`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold leading-snug text-fg">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{c.issuer}</p>
                  <a
                    href={c.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 text-sm font-medium text-accent transition hover:text-sky-300"
                  >
                    Verify on LinkedIn
                    <Icon name="external" className="h-3.5 w-3.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
