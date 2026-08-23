"use client";

import { useEffect } from "react";

/* ============================================================================
   LIQUI GEOMETRY ENGINE
   ----------------------------------------------------------------------------
   Generates TRUE continuous-curvature squircle outlines (sampled
   superellipse corners, exponent ~4.4 — the iOS-class profile) and applies
   them to every Liqui surface via the --liqui-clip custom property.

   Why: CSS border-radius produces circular corners (G1), and native
   `corner-shape` support is still rare. clip-path: path() renders genuine
   flowing corners in every modern browser, scaled precisely to each
   element's live size.

   Elements keep their border-radius as a no-JS/SSR fallback; once this
   engine runs, the sharper continuous outline takes over.
   ========================================================================== */

const EXPONENT = 4.4;
const SEGMENTS_PER_CORNER = 12;
const TARGET_SELECTOR = ".liqui-primary, .liqui-secondary, .liqui-deep, .liqui-shape";

function squirclePath(w: number, h: number, radius: number): string {
  const maxR = Math.min(w, h) / 2 - 0.01;
  const r = Math.max(0, Math.min(radius, maxR));
  if (r < 2 || w < 8 || h < 8) return "";

  const pts: string[] = [];
  const pow = 2 / EXPONENT;

  const corner = (cx: number, cy: number, start: number) => {
    for (let i = 0; i <= SEGMENTS_PER_CORNER; i++) {
      const t = start + (Math.PI / 2) * (i / SEGMENTS_PER_CORNER);
      const c = Math.cos(t);
      const s = Math.sin(t);
      const x = cx + Math.sign(c) * Math.pow(Math.abs(c), pow) * r;
      const y = cy + Math.sign(s) * Math.pow(Math.abs(s), pow) * r;
      pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }
  };

  // Top-right → bottom-right → bottom-left → top-left,
  // each quarter-arc leaving/entering tangentially along the edges.
  corner(w - r, r, -Math.PI / 2);
  corner(w - r, h - r, 0);
  corner(r, h - r, Math.PI / 2);
  corner(r, r, Math.PI);

  return `M${pts.join("L")}Z`;
}

function applyClip(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (w < 4 || h < 4) return;

  const styles = getComputedStyle(el);

  // Only symmetric corner radii can be squircled; asymmetric shapes
  // (e.g. edge-flush panels with rounded-r only) keep their fallback.
  const radii = [
    styles.borderTopLeftRadius,
    styles.borderTopRightRadius,
    styles.borderBottomRightRadius,
    styles.borderBottomLeftRadius,
  ];
  if (new Set(radii).size !== 1) {
    el.style.removeProperty("--liqui-clip");
    return;
  }

  const radiusRaw = parseFloat(radii[0]) || 0;
  const d = squirclePath(w, h, radiusRaw);

  if (d) {
    el.style.setProperty("--liqui-clip", `path("${d}")`);
  } else {
    el.style.removeProperty("--liqui-clip");
  }
}

export function LiquiGeometry() {
  useEffect(() => {
    const processed = new WeakSet<Element>();

    const scan = (root: ParentNode) => {
      const nodes = root.querySelectorAll ? root.querySelectorAll<HTMLElement>(TARGET_SELECTOR) : [];
      nodes.forEach((el) => {
        if (processed.has(el)) return;
        processed.add(el);
        applyClip(el);
        ro.observe(el);
      });
    };

    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => applyClip(entry.target as HTMLElement));
    });

    scan(document.body);

    const mo = new MutationObserver((mutations) => {
      let dirty = false;
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          dirty = true;
          if (node.matches(TARGET_SELECTOR)) {
            processed.add(node);
            applyClip(node);
            ro.observe(node);
          }
          node.querySelectorAll?.(TARGET_SELECTOR).forEach((child) => {
            processed.add(child);
            applyClip(child as HTMLElement);
            ro.observe(child);
          });
        });
      }
      if (dirty) {
        // Portals and late-mounted shells may shift layout once more.
        requestAnimationFrame(() => {
          document.querySelectorAll<HTMLElement>(TARGET_SELECTOR).forEach((el) => {
            if (!processed.has(el)) {
              processed.add(el);
              ro.observe(el);
            }
            applyClip(el);
          });
        });
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
