import { site } from "@/data/portfolio";
import CopyEmail from "./CopyEmail";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="wrap flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-fg">{site.name}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            © {new Date().getFullYear()} · {site.designation} · {site.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="grid h-11 w-11 place-items-center rounded-lg text-muted transition hover:text-accent"
          >
            <Icon name="linkedin" className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="grid h-11 w-11 place-items-center rounded-lg text-muted transition hover:text-accent"
          >
            <Icon name="github" className="h-[18px] w-[18px]" />
          </a>
          <CopyEmail variant="ghost" />
          <a
            href="#home"
            aria-label="Back to top"
            className="ml-1 grid h-11 w-11 place-items-center rounded-lg border border-line text-fg transition hover:border-accent/50 hover:text-accent"
          >
            <Icon name="arrow-up" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
