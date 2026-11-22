import Image from "next/image";
import type { CSSProperties } from "react";
import { site } from "@/data/portfolio";
import { showcase } from "@/data/showcase";

/**
 * Hero visual: portrait in the centre, technology visuals orbiting around it.
 * - Portrait:  site.portrait in src/data/portfolio.ts  (file: public/images/portrait.webp)
 * - Orbit gallery: src/data/showcase.ts                (files: public/images/showcase/*)
 * Pure CSS motion (see globals.css) — pauses on hover and respects prefers-reduced-motion.
 */
export default function OrbitShowcase() {
  const count = showcase.length;

  return (
    <div className="orbit mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] xl:max-w-[480px]">
      <div className="orbit-glow" aria-hidden="true" />
      <div className="orbit-track orbit-track-outer" aria-hidden="true" />
      <div className="orbit-track orbit-track-inner" aria-hidden="true" />

      <Image
        src={site.portrait.src}
        alt={site.portrait.alt}
        width={site.portrait.width}
        height={site.portrait.height}
        priority
        sizes="(min-width: 1280px) 330px, (min-width: 640px) 285px, 235px"
        className="orbit-portrait"
      />

      <ul className="orbit-ring" aria-label="Technology showcase">
        {showcase.map((item, i) => (
          <li
            key={item.id}
            className="orbit-item"
            style={
              {
                "--a": `${(360 / count) * i - 90}deg`,
                "--f": `${(i * 0.8).toFixed(1)}s`,
              } as CSSProperties
            }
          >
            <div className="orbit-counter">
              <div className="orbit-float">
                <figure className="orbit-bubble">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={160}
                    height={160}
                    sizes="100px"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="orbit-label" aria-hidden="true">
                    {item.label}
                  </figcaption>
                </figure>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
