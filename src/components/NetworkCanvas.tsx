"use client";

import { useEffect, useRef } from "react";

type NodeT = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };
type Packet = { a: number; b: number; t: number; speed: number; emerald: boolean };

const LINK_DIST = 190;

/**
 * Restrained network-topology / data-flow visual for the hero background.
 * - Honors prefers-reduced-motion (renders a single static frame)
 * - Pauses when off-screen or when the tab is hidden
 * - DPR-aware, delta-time based (smooth at 60fps)
 */
export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const parent = canvas?.parentElement;
    if (!canvas || !ctx || !parent) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let sinceSpawn = 0;
    let onScreen = true;
    let tabVisible = !document.hidden;
    let nodes: NodeT[] = [];
    let packets: Packet[] = [];

    const seed = () => {
      const count = Math.max(16, Math.min(50, Math.round((w * h) / 20000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        r: i % 7 === 0 ? 3.6 : 1.9,
        hub: i % 7 === 0,
      }));
      packets = [];
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0, false);
    };

    const draw = (dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);

      if (animate) {
        for (const n of nodes) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      const edges: [number, number][] = [];
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            edges.push([i, j]);
            const alpha = 0.34 * (1 - d / LINK_DIST);
            ctx.strokeStyle = `rgba(56,189,248,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        if (n.hub) {
          ctx.fillStyle = "rgba(56,189,248,0.12)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(56,189,248,0.9)";
        } else {
          ctx.fillStyle = "rgba(148,163,184,0.55)";
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!animate) return;

      // Data-flow packets travelling along links
      sinceSpawn += dt;
      if (sinceSpawn > 650 && packets.length < 7 && edges.length > 0) {
        sinceSpawn = 0;
        const [a, b] = edges[Math.floor(Math.random() * edges.length)];
        const flip = Math.random() > 0.5;
        packets.push({
          a: flip ? b : a,
          b: flip ? a : b,
          t: 0,
          speed: 0.00045 + Math.random() * 0.0004,
          emerald: Math.random() > 0.55,
        });
      }
      packets = packets.filter((p) => {
        p.t += p.speed * dt;
        if (p.t >= 1) return false;
        const A = nodes[p.a];
        const B = nodes[p.b];
        if (Math.hypot(A.x - B.x, A.y - B.y) > LINK_DIST * 1.15) return false;
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        const color = p.emerald ? "16,185,129" : "56,189,248";
        ctx.fillStyle = `rgba(${color},0.22)`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${color},1)`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(50, last ? time - last : 16);
      last = time;
      draw(dt, true);
    };

    const sync = () => {
      const shouldRun = !mq.matches && onScreen && tabVisible;
      if (shouldRun && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        if (mq.matches) draw(0, false);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(parent);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", sync);

    resize();
    sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}
