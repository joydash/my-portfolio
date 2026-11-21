import { site } from "@/data/portfolio";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";
import CvActions from "./CvActions";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk about your infrastructure team"
          description="Open to Banking & Enterprise IT roles — Network & Infrastructure Engineering, IT Operations and Systems Engineering."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <Reveal>
              <div className="card p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                  Email
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <CopyEmail />
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 text-sm font-medium text-fg transition hover:border-accent/50"
                  >
                    <Icon name="mail" className="h-4 w-4 text-accent" />
                    Open mail app
                  </a>
                </div>

                <div className="mt-6 space-y-1 border-t border-line pt-5 text-sm">
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 text-muted transition hover:text-fg"
                  >
                    <Icon name="linkedin" className="h-4 w-4 text-accent" />
                    linkedin.com/in/joy-dash
                  </a>
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 text-muted transition hover:text-fg"
                  >
                    <Icon name="github" className="h-4 w-4 text-accent" />
                    github.com/joydash
                  </a>
                  <p className="flex min-h-11 items-center gap-3 text-muted">
                    <Icon name="pin" className="h-4 w-4 text-accent" />
                    {site.location}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="card p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                  Curriculum Vitae
                </p>
                <p className="mt-2 mb-4 text-sm text-muted">
                  Preview it here or download the latest PDF.
                </p>
                <CvActions />
              </div>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-3" delay={60}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
