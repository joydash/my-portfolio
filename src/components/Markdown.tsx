import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Safe Markdown renderer: react-markdown does not render raw HTML, and we only allow
 * http(s)/mailto links. Elements are styled with Tailwind so no typography plugin is needed.
 */
const components: Components = {
  h1: (p) => <h2 className="mb-4 mt-10 text-3xl font-semibold tracking-tight text-fg" {...p} />,
  h2: (p) => <h2 className="mb-3 mt-10 text-2xl font-semibold tracking-tight text-fg" {...p} />,
  h3: (p) => <h3 className="mb-2 mt-8 text-xl font-semibold text-fg" {...p} />,
  h4: (p) => <h4 className="mb-2 mt-6 text-lg font-semibold text-fg" {...p} />,
  p: (p) => <p className="my-4 leading-relaxed text-fg/90" {...p} />,
  a: ({ href, ...p }) => {
    const safe = href && /^(https?:|mailto:|\/|#)/i.test(href) ? href : undefined;
    const external = safe?.startsWith("http");
    return (
      <a
        href={safe}
        className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...p}
      />
    );
  },
  ul: (p) => <ul className="my-4 list-disc space-y-1.5 pl-6 text-fg/90 marker:text-accent" {...p} />,
  ol: (p) => <ol className="my-4 list-decimal space-y-1.5 pl-6 text-fg/90 marker:text-accent" {...p} />,
  li: (p) => <li className="leading-relaxed" {...p} />,
  blockquote: (p) => <blockquote className="my-6 border-l-2 border-accent/60 pl-4 italic text-muted" {...p} />,
  hr: () => <hr className="my-8 border-line" />,
  img: ({ src, alt }) =>
    typeof src === "string" && /^https:\/\//i.test(src) ? (
      // eslint-disable-next-line @next/next/no-img-element -- Markdown images come from arbitrary hosts
      <img src={src} alt={alt ?? ""} loading="lazy" className="my-6 h-auto max-w-full rounded-lg border border-line" />
    ) : null,
  pre: (p) => (
    <pre className="my-5 overflow-x-auto rounded-lg border border-line bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-fg" {...p} />
  ),
  code: ({ className, children, ...p }) => (
    <code
      className={`font-mono ${className ? "" : "rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-accent"} ${className ?? ""}`}
      {...p}
    >
      {children}
    </code>
  ),
  table: (p) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...p} />
    </div>
  ),
  th: (p) => <th className="border-b border-line px-3 py-2 font-semibold text-fg" {...p} />,
  td: (p) => <td className="border-b border-line/60 px-3 py-2 text-fg/90" {...p} />,
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
