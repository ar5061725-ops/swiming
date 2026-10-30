'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { useApp } from '@/context/AppContext';
import { AGE_GROUPS, PRICE, fill, type ErrorKey, type Program, type Quote } from '@/lib/domain';
import { sx } from '@/lib/sx';

export function StepProgress({ cur }: { cur: number }) {
  const { t, num } = useApp();
  return (
    <nav aria-label={t.steps.progressLabel} className="steps">
      <p className="msg" style={sx('margin-bottom:8px')}>{fill(t.steps.stepOf, { n: num(Math.min(cur, 5)) })}</p>
      <ol style={sx('list-style:none;margin:0;padding:0;display:flex;gap:6px')}>
        {t.steps.items.map((s, i) => {
          const n = i + 1, done = n < cur, now = n === cur;
          const inner = (
            <>
              <div style={{ height: 6, borderRadius: 999, background: done || now ? 'var(--btn)' : 'var(--line)' }} />
              <div style={sx('display:flex;align-items:center;gap:6px;min-width:0')}>
                <span style={{ ...sx('width:26px;height:26px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:800'), border: `2px solid ${done || now ? 'var(--btn)' : 'var(--line)'}`, background: done ? 'var(--btn)' : 'var(--card)', color: done ? '#fff' : 'var(--ink)' }}>
                  {done ? <Icon name="check" size={14} stroke={3} /> : num(n)}
                </span>
                <span style={{ ...sx('font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'), fontWeight: now ? 800 : 500, color: now ? 'var(--ink)' : 'var(--muted)' }}>{s.title}</span>
              </div>
            </>
          );
          return (
            <li key={n} aria-current={now ? 'step' : undefined} style={sx('flex:1;min-width:0;display:flex;flex-direction:column;gap:8px')}>
              {n === 1 && cur > 1 && cur < 6
                ? <Link href="/programs" className="tap" style={sx('text-decoration:none;display:flex;flex-direction:column;gap:8px;color:inherit')}>{inner}</Link>
                : inner}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function LoadingGrid({ count = 3, min = 280 }: { count?: number; min?: number }) {
  const { t } = useApp();
  return (
    <div role="status" aria-busy="true" className="grid rail" style={sx(`--min:${min}px`)}>
      <span className="sr">{t.common.loading}</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" aria-hidden="true" style={sx('padding:20px;display:flex;flex-direction:column;gap:14px')}>
          <div className="skel" style={sx('height:26px;width:45%')} /><div className="skel" style={sx('height:22px;width:70%')} />
          <div style={sx('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>{[0, 1, 2, 3].map((k) => <div key={k} className="skel" style={sx('height:36px')} />)}</div>
          <div className="skel" style={sx('height:8px')} /><div className="skel" style={sx('height:48px;border-radius:14px')} />
        </div>
      ))}
    </div>
  );
}

export function StateView({ kind, title, text, label, onAct, extra }: { kind: 'error' | 'empty'; title: string; text: string; label?: string; onAct?: () => void; extra?: ReactNode }) {
  const err = kind === 'error';
  return (
    <div className="card" role={err ? 'alert' : 'status'} style={{ ...sx('padding:36px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px'), ...(err ? { borderColor: 'var(--bad)' } : null) }}>
      <span style={{ ...sx('width:64px;height:64px;border-radius:20px;display:grid;place-items:center'), background: err ? 'var(--bad-tint)' : 'var(--brand-tint)', color: err ? 'var(--bad)' : 'var(--link)' }}><Icon name={err ? 'alert' : 'wave'} size={30} /></span>
      <h3 style={sx('font-size:21px;font-weight:800')}>{title}</h3>
      {text && <p className="lead" style={sx('max-width:30em;font-size:16px')}>{text}</p>}
      {onAct && <button type="button" className="btn btn-primary" onClick={onAct}>{err && <Icon name="refresh" size={18} />}{label}</button>}
      {extra}
    </div>
  );
}

export function ProgramCard({ p, onPick }: { p: Program; onPick: (p: Program) => void }) {
  const { t, num, kwd, ageName, ageRange, waitlist, toggleWaitlist, showToast, a } = useApp();
  const g = AGE_GROUPS[p.age];
  const full = p.seats === 0, low = !full && p.seats / p.cap <= 0.25;
  const badge = full ? t.program.badges.full : low ? t.program.badges.almostFull : p.badge ? t.program.badges[p.badge] : '';
  const fillPct = Math.round((1 - p.seats / p.cap) * 100);
  const seatColor = full ? 'var(--muted)' : low ? 'var(--bad)' : 'var(--ok)';
  const wait = !!waitlist[p.id];
  return (
    <article className="card" aria-label={ageName(p.age)} style={sx('overflow:hidden;display:flex;flex-direction:column')}>
      <div style={{ ...sx('padding:18px 20px 16px;display:flex;flex-direction:column;gap:10px'), background: `color-mix(in srgb, ${g.color} 13%, var(--card))` }}>
        <div style={sx('display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap')}>
          <span className="pill" style={sx('background:var(--card);color:var(--ink)')}>{ageRange(p.age)} {t.common.years} · {t.gender[p.gender]}</span>
          {badge && <span className="tag" style={{ background: low ? 'var(--coral)' : 'var(--ink)', color: full ? 'var(--bg)' : '#fff' }}>{badge}</span>}
        </div>
        <h3 style={sx('font-size:22px;font-weight:800')}>{ageName(p.age)}</h3>
      </div>
      <dl style={sx('margin:0;padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;font-size:15px')}>
        <div><dt className="msg" style={sx('font-size:13px')}>{t.program.shift}</dt><dd style={sx('margin:0;font-weight:700')}>{t.shifts.names[p.shift]}</dd></div>
        <div><dt className="msg" style={sx('font-size:13px')}>{t.program.starts}</dt><dd style={sx('margin:0;font-weight:700')}>{fill(t.program.round, { n: num(p.round) })} · {t.common.placeholderDate}</dd></div>
        <div><dt className="msg" style={sx('font-size:13px')}>{t.program.duration}</dt><dd style={sx('margin:0;font-weight:700')}>{t.program.durationValue}</dd></div>
        <div><dt className="msg" style={sx('font-size:13px')}>{t.program.price}</dt><dd className="num" style={sx('margin:0;font-weight:800')}>{kwd(PRICE)}</dd></div>
      </dl>
      <div style={sx('padding:0 20px 16px;display:flex;flex-direction:column;gap:8px')}>
        <div style={sx('display:flex;justify-content:space-between;font-size:14px')}><span className="msg">{t.program.seats}</span><strong className="num" style={{ color: seatColor }}>{full ? t.program.noSeats : fill(t.program.seatsLeft, { left: num(p.seats), cap: num(p.cap) })}</strong></div>
        <div className="bar" role="progressbar" aria-label={t.program.fillLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={fillPct} style={sx('height:8px')}><i style={{ width: `${fillPct}%`, background: seatColor }} /></div>
      </div>
      <div style={sx('margin-top:auto;padding:0 20px 20px;display:flex')}>
        {full
          ? <button type="button" className="btn btn-ghost btn-block" aria-pressed={wait} onClick={() => { toggleWaitlist(p.id); showToast(wait ? a.toastWaitlistOff : a.toastWaitlist); }}>{wait ? t.program.waitlisted : t.program.waitlist}</button>
          : <button type="button" className="btn btn-primary btn-block" onClick={() => onPick(p)}>{t.program.choose}</button>}
      </div>
    </article>
  );
}

interface FieldProps {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: ErrorKey; hint?: string;
  type?: string; inputMode?: 'numeric' | 'email' | 'text'; autoComplete?: string; prefix?: string; ltr?: boolean; placeholder?: string; multiline?: boolean; optional?: boolean;
}

export function Field(o: FieldProps) {
  const { t } = useApp();
  const err = o.error ? t.errors[o.error] : '';
  const msg = err || o.hint || '';
  return (
    <div className="field">
      <label htmlFor={o.id}>{o.label}{o.optional ? <> <span className="opt">({t.common.optional})</span></> : <> <span className="req" aria-hidden="true">*</span></>}</label>
      <div className={`ctl ${err ? 'err' : ''}`} dir={o.ltr ? 'ltr' : undefined}>
        {o.prefix && <span className="pre" aria-hidden="true">{o.prefix}</span>}
        {o.multiline
          ? <textarea id={o.id} rows={3} value={o.value} onChange={(e) => o.onChange(e.target.value)} aria-invalid={!!err} aria-describedby={`${o.id}-m`} placeholder={o.placeholder} />
          : <input id={o.id} type={o.type || 'text'} inputMode={o.inputMode} autoComplete={o.autoComplete} value={o.value} onChange={(e) => o.onChange(e.target.value)} placeholder={o.placeholder} aria-invalid={!!err} aria-describedby={`${o.id}-m`} dir={o.ltr ? 'ltr' : undefined} style={o.ltr ? { textAlign: 'start' } : undefined} />}
      </div>
      <span id={`${o.id}-m`} className={`msg ${err ? 'err' : ''}`}>{msg}</span>
    </div>
  );
}

export function OrderSummary({ lines, q, showDiscount, promoCode }: { lines: { title: string; sub: string }[]; q: Quote; showDiscount: boolean; promoCode: string }) {
  const { t, num, kwd } = useApp();
  const disc = showDiscount && q.discount > 0;
  return (
    <aside className="card" aria-label={t.summary.title} style={sx('padding:22px;display:flex;flex-direction:column;gap:14px')}>
      <h2 style={sx('font-size:19px;font-weight:800')}>{t.summary.title}</h2>
      {!lines.length && <p className="msg">{t.summary.empty}</p>}
      <ul style={sx('list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px')}>
        {lines.map((l, i) => (
          <li key={i} style={sx('display:flex;justify-content:space-between;gap:12px')}>
            <span style={sx('min-width:0')}><strong style={sx('display:block')}>{l.title}</strong><span className="msg">{l.sub}</span></span>
            <span className="num" style={sx('font-weight:700;white-space:nowrap')}>{kwd(PRICE)}</span>
          </li>
        ))}
      </ul>
      <div style={sx('height:1px;background:var(--line)')} />
      <div style={sx('display:flex;justify-content:space-between;gap:12px')}><span className="msg" style={sx('font-size:15px')}>{t.summary.subtotal}</span><span className="num">{kwd(q.subtotal)}</span></div>
      {disc && (
        <div style={sx('display:flex;justify-content:space-between;gap:12px;color:var(--ok);font-weight:700')}>
          <span>{q.source === 'promo' ? fill(t.summary.promo, { code: promoCode, pct: num(q.pct) }) : fill(t.summary.sibling, { pct: num(q.sib) })}</span><span className="num">− {kwd(q.discount)}</span>
        </div>
      )}
      <div style={sx('display:flex;justify-content:space-between;align-items:baseline;gap:12px')}>
        <strong style={sx('font-size:17px')}>{t.summary.total}</strong>
        <span style={sx('display:flex;flex-direction:column;align-items:flex-end')}>
          {disc && <s className="msg num">{kwd(q.subtotal)}</s>}
          <strong className="num" style={sx('font-size:30px;font-weight:800;line-height:1.2')}>{kwd(showDiscount ? q.total : q.subtotal)}</strong>
        </span>
      </div>
      {disc && <p className="notice n-ok" style={sx('font-size:15px')}>{fill(t.summary.saved, { amount: kwd(q.discount) })}</p>}
      <p className="msg" style={sx('font-size:13px')}>{t.summary.note}</p>
    </aside>
  );
}
