import Link from "next/link";
import type { ProjectRow } from "@/lib/types";
import Icon from "./Icon";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** Homepage section: the top featured projects with a link to the full list. */
export default function ProjectsPreview({ projects }: { projects: ProjectRow[] }) {
  return (
    <section id="projects" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Hands-on network & infrastructure builds"
          description="A selection of recent work. Browse everything, filter by technology, and open live demos or source code."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <Reveal key={p.id} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 font-semibold text-ink transition hover:bg-sky-300"
          >
            More Projects <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
