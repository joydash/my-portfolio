"use client";

import { useCallback, useState } from "react";
import { site } from "@/data/portfolio";
import Icon from "./Icon";
import Modal from "./Modal";

export default function CvActions() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white/[0.03] px-4 text-sm font-semibold text-fg transition hover:border-accent/50 hover:bg-white/[0.06]"
        >
          <Icon name="eye" className="h-4 w-4 text-accent" />
          Preview CV
        </button>
        <a
          href={site.cvPath}
          download={site.cvDownloadName}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-ink transition hover:bg-sky-300"
        >
          <Icon name="download" className="h-4 w-4" />
          Download CV
        </a>
      </div>

      <Modal open={open} onClose={close} title="Curriculum Vitae — Joy Dash" eyebrow="PDF preview" wide>
        <iframe
          src={`${site.cvPath}#view=FitH`}
          title="Joy Dash — Curriculum Vitae (PDF preview)"
          className="h-[62vh] w-full rounded-lg border border-line bg-white"
        />
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          Preview not loading?
          <a
            href={site.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-accent hover:text-sky-300"
          >
            Open in a new tab <Icon name="external" className="h-3.5 w-3.5" />
          </a>
          <a
            href={site.cvPath}
            download={site.cvDownloadName}
            className="inline-flex min-h-11 items-center gap-1.5 text-accent hover:text-sky-300"
          >
            Download <Icon name="download" className="h-3.5 w-3.5" />
          </a>
        </p>
      </Modal>
    </>
  );
}
