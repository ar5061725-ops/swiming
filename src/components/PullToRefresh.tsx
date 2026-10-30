'use client';

import { useEffect, useRef, useState } from 'react';
import { buzz, useApp } from '@/context/AppContext';

/** Pull-down-to-refresh indicator. Owns its touch listeners so the page does not re-render while dragging. */
export function PullToRefresh({ onRefresh }: { onRefresh: () => Promise<unknown> }) {
  const { a, showToast } = useApp();
  const [ui, setUi] = useState({ h: 0, mode: 'idle' as 'idle' | 'pull' | 'release' | 'busy', angle: 0, animate: false });
  const refresh = useRef(onRefresh);
  refresh.current = onRefresh;
  const strings = useRef(a);
  strings.current = a;

  useEffect(() => {
    let g: { x: number; y: number; axis: 'x' | 'y' | null; h: number } | null = null;
    const start = (ev: TouchEvent) => {
      const target = ev.target as Element;
      if (ev.touches.length !== 1 || window.scrollY > 0 || target.closest('[data-swipe], #sheet')) { g = null; return; }
      g = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, axis: null, h: 0 };
    };
    const move = (ev: TouchEvent) => {
      if (!g) return;
      const dx = ev.touches[0].clientX - g.x, dy = ev.touches[0].clientY - g.y;
      if (!g.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (g.axis === 'y' && dy > 0 && window.scrollY <= 0) {
        g.h = Math.min(80, dy * 0.5);
        setUi({ h: g.h, mode: g.h >= 60 ? 'release' : 'pull', angle: dy * 3, animate: false });
      }
    };
    const end = () => {
      if (!g) return;
      const cur = g; g = null;
      if (cur.h >= 60) {
        buzz();
        setUi({ h: 48, mode: 'busy', angle: 0, animate: true });
        refresh.current().then(() => { setUi({ h: 0, mode: 'idle', angle: 0, animate: true }); showToast(strings.current.refreshed); });
      } else setUi({ h: 0, mode: 'idle', angle: 0, animate: true });
    };
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', end, { passive: true });
    document.addEventListener('touchcancel', end, { passive: true });
    return () => {
      document.removeEventListener('touchstart', start);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
      document.removeEventListener('touchcancel', end);
    };
  }, [showToast]);

  const label = ui.mode === 'busy' ? a.refreshing : ui.mode === 'release' ? a.release : a.pull;
  return (
    <div className="ptr" aria-hidden="true" style={{ height: ui.h, transition: ui.animate ? 'height .2s' : 'none' }}>
      {ui.mode !== 'idle' && (
        <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <span className="spin dark" style={ui.mode === 'busy' ? undefined : { animationPlayState: 'paused', transform: `rotate(${ui.angle}deg)` }} />{label}
        </span>
      )}
    </div>
  );
}
