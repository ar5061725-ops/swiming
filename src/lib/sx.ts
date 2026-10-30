import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

/** Turns a CSS declaration string ("display:flex;gap:8px") into a React style object, keeping the design's inline CSS verbatim. */
export function sx(css: string): CSSProperties {
  const hit = cache.get(css);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const key = decl.slice(0, i).trim();
    if (!key) continue;
    out[key.startsWith('--') ? key : key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = decl.slice(i + 1).trim();
  }
  cache.set(css, out);
  return out;
}
