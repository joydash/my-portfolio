import Image from "next/image";
import { site } from "@/data/portfolio";
import Icon from "./Icon";
import NetworkCanvas from "./NetworkCanvas";

const quick = [
  { href: site.linkedin, label: "LinkedIn profile", icon: "linkedin" as const, external: true },
  { href: site.github, label: "GitHub profile", icon: "github" as const, external: true },
  { href: `mailto:${site.email}`, label: `Email ${site.email}`, icon: "mail" as const, external: false },
];

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pb-20">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="grid-bg absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 90% 80% at 60% 40%, #000 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 60% 40%, #000 20%, transparent 85%)",
          }}
        >
          <NetworkCanvas />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="wrap grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p
            className="inline-flex items-center gap-2.5 rounded-full border border-ok/30 bg-ok/10 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wider text-ok sm:text-xs"
            role="status"
          >
            <span className="status-dot relative h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
            {site.availability}
          </p>

          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Joy <span className="gradient-text">Dash</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-fg sm:text-xl">
            {site.designation}
            <span className="text-muted"> — {site.focus}</span>
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{site.valueProposition}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 font-semibold text-ink transition hover:bg-sky-300"
            >
              Explore Case Studies
              <Icon name="arrow-right" className="h-4 w-4" />
            </a>
            <a
              href={site.cvPath}
              download={site.cvDownloadName}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-white/[0.03] px-6 font-semibold text-fg transition hover:border-accent/50 hover:bg-white/[0.06]"
            >
              <Icon name="download" className="h-4 w-4 text-accent" />
              Download CV
            </a>
            <ul className="ml-1 flex items-center gap-1.5">
              {quick.map((q) => (
                <li key={q.label}>
                  <a
                    href={q.href}
                    aria-label={q.label}
                    {...(q.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="grid h-11 w-11 place-items-center rounded-lg border border-line text-muted transition hover:border-accent/50 hover:text-accent"
                  >
                    <Icon name={q.icon} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-5">
            {[
              ["Tier 2/3", "NOC & corporate support"],
              ["MTCNA", "MikroTik certified"],
              ["B.Sc. CSE", "7th semester running"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-sm font-semibold text-fg sm:text-base">{k}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px]">
            <div
              className="absolute -inset-12 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.2),transparent_72%)]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-4 bottom-0 top-12 -z-10 rounded-[2rem] border border-line bg-gradient-to-b from-surface/70 to-transparent"
              aria-hidden="true"
            />
            <Image
              src="/images/joy.webp"
              alt="Portrait of Joy Dash, Support Engineer"
              width={792}
              height={1032}
              priority
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 400px, (min-width: 640px) 360px, 280px"
              className="relative h-auto w-full"
              style={{
                maskImage: "linear-gradient(to right, #000 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, #000 80%, transparent 100%)",
              }}
            />
            <div className="glass absolute -left-6 top-[58%] hidden rounded-xl border border-line px-3.5 py-2.5 shadow-xl xl:block">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Certified
              </p>
              <p className="text-sm font-semibold text-fg">MikroTik MTCNA</p>
            </div>
            <div className="glass absolute -right-4 top-[20%] hidden rounded-xl border border-line px-3.5 py-2.5 shadow-xl xl:block">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Focus
              </p>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                BGP · OSPF · FTTH
              </p>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 xl:hidden">
            <li className="glass rounded-lg border border-line px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Certified </span>
              <span className="text-sm font-semibold text-fg">MikroTik MTCNA</span>
            </li>
            <li className="glass flex items-center gap-1.5 rounded-lg border border-line px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
              <span className="text-sm font-semibold text-fg">BGP · OSPF · FTTH</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
