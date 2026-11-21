import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-8 max-w-2xl sm:mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        <span className="text-ok">{"//"}</span> {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 leading-relaxed text-muted">{description}</p>}
    </Reveal>
  );
}