import About from "@/components/About";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import EducationSection from "@/components/EducationSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Hero from "@/components/Hero";
import SiteShell from "@/components/SiteShell";
import { getHomeProjects, getLatestBlogs } from "@/lib/data";
import Pillars from "@/components/Pillars";
import BlogPreview from "@/components/BlogPreview";
import ProjectsPreview from "@/components/ProjectsPreview";
import Skills from "@/components/Skills";
import Toolkit from "@/components/Toolkit";

// Static shell, refreshed every 5 minutes (and instantly when the admin saves, via revalidatePath).
export const revalidate = 300;

export default async function Home() {
  const [projects, posts] = await Promise.all([getHomeProjects(4), getLatestBlogs(3)]);
  return (
    <SiteShell>
      <Hero />
      <About />
      <Pillars />
      <ExperienceTimeline />
      <ProjectsPreview projects={projects} />
      <BlogPreview posts={posts} />
      <Skills />
      <Toolkit />
      <Certifications />
      <EducationSection />
      <Contact />
    </SiteShell>
  );
}
