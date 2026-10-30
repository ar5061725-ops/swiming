'use client';

import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useApp, type DemoFlags } from '@/context/AppContext';
import { sx } from '@/lib/sx';

export function Sheet() {
  const { a, sheet, setSheet, demo, setDemoFlag } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheet(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sheet, setSheet]);

  if (!sheet) return null;
  const close = () => setSheet(null);

  const onStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const onMove = (e: React.TouchEvent) => {
    if (startY.current === null || !ref.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) { ref.current.style.transition = 'none'; ref.current.style.transform = `translateY(${dy}px)`; }
  };
  const onEnd = (e: React.TouchEvent) => {
    if (startY.current === null || !ref.current) return;
    const dy = e.changedTouches[0].clientY - startY.current;
    startY.current = null;
    if (dy > 100) close();
    else { ref.current.style.transition = 'transform .2s ease'; ref.current.style.transform = ''; }
  };

  const row = (k: keyof DemoFlags, label: string) => (
    <label className="check" style={sx('align-items:center')}>
      <input type="checkbox" checked={demo[k]} onChange={(e) => setDemoFlag(k, e.target.checked)} /><span>{label}</span>
    </label>
  );

  return (
    <>
      <div className="scrim" onClick={close} />
      <div className="sheet" ref={ref} role="dialog" aria-modal="true" aria-labelledby="sheet-t" onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}>
        <div className="grab" />
        {sheet.type === 'demo' ? (
          <>
            <h2 id="sheet-t" style={sx('font-size:22px;font-weight:800')}>{a.demoTitle}</h2>
            <p className="msg">{a.demoLead}</p>
            {row('netFail', a.demoNetFail)}{row('payFail', a.demoPayFail)}{row('shortHold', a.demoShortHold)}
            <button type="button" className="btn btn-primary btn-block" onClick={close}>{a.done}</button>
          </>
        ) : (
          <>
            <div style={sx('display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px')}>
              <span style={{ ...sx('width:76px;height:76px;border-radius:50%;color:#fff;display:grid;place-items:center'), background: sheet.badge.color, opacity: sheet.badge.got ? 1 : 0.5 }}><Icon name="award" size={36} /></span>
              <h2 id="sheet-t" style={sx('font-size:22px;font-weight:800')}>{sheet.badge.name}</h2>
              <p className="lead">{(sheet.badge.got ? '' : a.badgeLocked) + sheet.badge.desc}</p>
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={close}>{a.done}</button>
          </>
        )}
        <p className="msg" style={sx('text-align:center;font-size:13px')}>{a.dragClose}</p>
      </div>
    </>
  );
}
