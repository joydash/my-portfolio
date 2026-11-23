import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectsGrid from "@/components/ProjectsGrid";
import SiteShell from "@/components/SiteShell";
import { getProjects } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "Network, infrastructure and systems projects by Joy Dash — filter by technology, with live demos and source code.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <SiteShell>
      <section className="py-10 pt-28 sm:py-14 sm:pt-32">
        <div className="wrap">
          <SectionHeading
            eyebrow="Projects"
            title="All projects"
            description="Filter by technology to find what's relevant. Live demos and source code are linked where available."
          />
          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </SiteShell>
  );
}
