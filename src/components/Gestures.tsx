'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { buzz, useApp } from '@/context/AppContext';

/** Instant press feedback (Safari delays :active without this) + edge-swipe back. Renders only the edge hint. */
export function Gestures() {
  const { lang, canGoBack, sheet } = useApp();
  const router = useRouter();
  const hint = useRef<HTMLDivElement>(null);
  const state = useRef({ canGoBack, sheet: !!sheet, rtl: lang === 'ar' });
  state.current = { canGoBack, sheet: !!sheet, rtl: lang === 'ar' };

  useEffect(() => {
    const press = 'button, a, [data-press], label.tap';
    const clear = () => document.querySelectorAll('.is-pressed').forEach((n) => n.classList.remove('is-pressed'));
    const down = (ev: PointerEvent) => (ev.target as Element | null)?.closest(press)?.classList.add('is-pressed');
    document.addEventListener('pointerdown', down, { passive: true });
    const ends = ['pointerup', 'pointercancel', 'pointerleave', 'dragstart'];
    ends.forEach((t) => document.addEventListener(t, clear, { passive: true }));

    let g: { x: number; y: number; t: number; axis: 'x' | 'y' | null } | null = null;
    const view = () => document.getElementById('view');
    const start = (ev: TouchEvent) => {
      const s = state.current;
      if (ev.touches.length !== 1 || !s.canGoBack || s.sheet) { g = null; return; }
      const p = ev.touches[0], w = window.innerWidth;
      const fromEdge = s.rtl ? p.clientX > w - 28 : p.clientX < 28;
      g = fromEdge ? { x: p.clientX, y: p.clientY, t: Date.now(), axis: null } : null;
    };
    const move = (ev: TouchEvent) => {
      if (!g) return;
      const p = ev.touches[0], dx = p.clientX - g.x, dy = p.clientY - g.y, rtl = state.current.rtl;
      if (!g.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (g.axis !== 'x') return;
      const inward = rtl ? -dx : dx;
      const v = view();
      if (v) { v.style.transition = 'none'; v.style.transform = `translateX(${(rtl ? -1 : 1) * Math.max(0, inward) * 0.5}px)`; }
      const h = hint.current;
      if (h) { h.style.opacity = String(Math.min(1, inward / 90)); h.style[rtl ? 'right' : 'left'] = `${Math.min(60, inward / 2)}px`; h.style[rtl ? 'left' : 'right'] = 'auto'; }
    };
    const end = (ev: TouchEvent) => {
      if (!g) return;
      const cur = g; g = null;
      const dx = ev.changedTouches[0].clientX - cur.x, rtl = state.current.rtl;
      const inward = rtl ? -dx : dx;
      if (hint.current) hint.current.style.opacity = '0';
      if (cur.axis === 'x' && (inward > 90 || (Date.now() - cur.t < 300 && inward > 40))) { buzz(); router.back(); }
      const v = view();
      if (v) { v.style.transition = 'transform .2s ease'; v.style.transform = ''; }
    };
    const cancel = () => { g = null; const v = view(); if (v) v.style.transform = ''; if (hint.current) hint.current.style.opacity = '0'; };
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', end, { passive: true });
    document.addEventListener('touchcancel', cancel, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', down);
      ends.forEach((t) => document.removeEventListener(t, clear));
      document.removeEventListener('touchstart', start);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
      document.removeEventListener('touchcancel', cancel);
    };
  }, [router]);

  return <div ref={hint} className="edge-hint" aria-hidden="true"><Icon name={lang === 'ar' ? 'back' : 'fwd'} size={22} stroke={2.4} /></div>;
}
