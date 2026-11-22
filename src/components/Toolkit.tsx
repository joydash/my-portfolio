import { toolkit } from "@/data/portfolio";
import Reveal from "./Reveal";

export default function Toolkit() {
  return (
    <section id="toolkit" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <Reveal className="mb-8 max-w-2xl sm:mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <span className="text-ok">{"//"}</span> Toolkit
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Technical toolkit<span className="text-accent">.</span>
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            The tools I rely on every day to configure, monitor and troubleshoot enterprise networks.
          </p>
        </Reveal>

        <ol className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {toolkit.map((t, i) => (
            <li key={t.no}>
              <Reveal delay={(i % 4) * 60} className="h-full">
                <article className="card tool group flex h-full flex-col p-4 sm:p-5">
                  <span className="font-mono text-xs font-semibold text-muted transition-colors group-hover:text-accent">
                    {t.no}
                  </span>
                  <h3 className="mt-4 text-base font-semibold leading-snug text-fg sm:text-lg">
                    {t.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">{t.role}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
