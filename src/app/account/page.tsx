'use client';

import { useRef, useState, type FormEvent, type TouchEvent } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PullToRefresh } from '@/components/PullToRefresh';
import { LoadingGrid, StateView } from '@/components/ui';
import { buzz, useApp } from '@/context/AppContext';
import { useLoader } from '@/hooks/useLoader';
import { ACCOUNT_DATA } from '@/lib/data';
import { AGE_GROUPS, fakeApi, fill } from '@/lib/domain';
import { sx } from '@/lib/sx';

type Tab = 'overview' | 'payments' | 'notifications';
const TABS: Tab[] = ['overview', 'payments', 'notifications'];
type Absence = { open: boolean; reason: string; status: 'idle' | 'invalid' | 'sending' | 'done' };

function SwipeNotif({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const g = useRef<{ x: number; y: number; axis: 'x' | 'y' | null } | null>(null);
  const start = (e: TouchEvent) => { g.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, axis: null }; };
  const move = (e: TouchEvent) => {
    const s = g.current; if (!s || !ref.current) return;
    const dx = e.touches[0].clientX - s.x, dy = e.touches[0].clientY - s.y;
    if (!s.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (s.axis === 'x') { ref.current.style.transition = 'none'; ref.current.style.transform = `translateX(${dx}px)`; }
  };
  const end = (e: TouchEvent) => {
    const s = g.current, el = ref.current; g.current = null;
    if (!s || !el) return;
    const dx = e.changedTouches[0].clientX - s.x;
    if (s.axis === 'x' && Math.abs(dx) > 110) { el.style.transition = 'transform .18s ease'; el.style.transform = `translateX(${dx > 0 ? 120 : -120}%)`; buzz(); setTimeout(onDelete, 160); }
    else { el.style.transition = 'transform .2s ease'; el.style.transform = ''; }
  };
  return (
    <div ref={ref} data-swipe="notif" className="card" onTouchStart={start} onTouchMove={move} onTouchEnd={end} onTouchCancel={end}
      style={{ ...sx('position:relative;border-radius:18px;padding:14px 56px 14px 16px;display:flex;gap:12px;align-items:flex-start;touch-action:pan-y;user-select:none'), paddingInline: '16px 56px' }}>
      {children}
    </div>
  );
}

export default function AccountPage() {
  const { t, a, lang, num, kwd, ageName, L, showToast, setSheet } = useApp();
  const ac = t.account;
  const { status, reload, refresh } = useLoader('account', 700);
  const [tab, setTab] = useState<Tab>('overview');
  const [anim, setAnim] = useState('');
  const [qr, setQr] = useState<Record<number, boolean>>({});
  const [absence, setAbsence] = useState<Record<number, Absence>>({});
  const [readAll, setReadAll] = useState(false);
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const tg = useRef<{ x: number; y: number; axis: 'x' | 'y' | null } | null>(null);

  const notifs = ACCOUNT_DATA.notifs.filter((n) => !removed[n.id]);
  const unread = notifs.filter((n) => n.unread && !readAll).length;
  const abs = (id: number): Absence => absence[id] || { open: false, reason: '', status: 'idle' };
  const setAbs = (id: number, p: Partial<Absence>) => setAbsence((s) => ({ ...s, [id]: { ...abs(id), ...p } }));

  const delNotif = (id: string) => {
    setRemoved((s) => ({ ...s, [id]: true }));
    showToast(a.toastDeleted, { label: a.undo, run: () => setRemoved((s) => { const { [id]: _d, ...rest } = s; return rest; }) });
  };
  const submitAbsence = (ev: FormEvent, id: number) => {
    ev.preventDefault();
    if (!abs(id).reason) { setAbs(id, { status: 'invalid' }); return; }
    setAbs(id, { status: 'sending' });
    fakeApi(true, 700).then(() => { setAbs(id, { status: 'done' }); showToast(a.toastAbsence); });
  };

  // Swipe between the account sections (ignores horizontally scrollable children and swipe-to-delete rows).
  const tabStart = (e: TouchEvent) => {
    const target = e.target as Element;
    tg.current = target.closest('.rail, .tbl-wrap, [data-swipe="notif"], [style*="overflow-x"]') ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY, axis: null };
  };
  const tabMove = (e: TouchEvent) => {
    const s = tg.current; if (!s || !panelRef.current) return;
    const dx = e.touches[0].clientX - s.x, dy = e.touches[0].clientY - s.y;
    if (!s.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (s.axis === 'x') { panelRef.current.style.transition = 'none'; panelRef.current.style.transform = `translateX(${dx * 0.35}px)`; }
  };
  const tabEnd = (e: TouchEvent) => {
    const s = tg.current, el = panelRef.current; tg.current = null;
    if (!s || !el) return;
    el.style.transition = 'transform .2s ease'; el.style.transform = '';
    const dx = e.changedTouches[0].clientX - s.x;
    if (s.axis === 'x' && Math.abs(dx) > 70) {
      const i = TABS.indexOf(tab);
      const forward = lang === 'ar' ? dx > 0 : dx < 0;
      const ni = Math.max(0, Math.min(TABS.length - 1, i + (forward ? 1 : -1)));
      if (ni !== i) { buzz(); setAnim(forward ? 'enter-fwd' : 'enter-back'); setTab(TABS[ni]); }
    }
  };

  let panel: React.ReactNode;
  if (status === 'loading') panel = <LoadingGrid count={2} min={400} />;
  else if (status === 'error') panel = <StateView kind="error" title={ac.errorTitle} text={ac.errorText} onAct={reload} label={t.common.retry} />;
  else if (tab === 'overview') {
    panel = (
      <div className="grid rail" style={sx('--min:400px;gap:20px')}>
        {ACCOUNT_DATA.kids.map((k) => {
          const g = AGE_GROUPS[k.age], ab = abs(k.id);
          const pct = Math.round((k.skills[0] / k.skills[1]) * 100);
          const progress = fill(ac.progress, { level: L(k.level) });
          const absMsg = { idle: ac.absenceHint, invalid: ac.absenceInvalid, sending: ac.sending, done: ac.absenceDone }[ab.status];
          return (
            <article key={k.id} className="card" style={sx('overflow:hidden;display:flex;flex-direction:column')}>
              <div style={{ ...sx('padding:18px 20px;display:flex;align-items:center;gap:14px'), background: `color-mix(in srgb, ${g.color} 13%, var(--card))` }}>
                <span aria-hidden="true" style={{ ...sx('width:56px;height:56px;flex:none;border-radius:18px;display:grid;place-items:center;color:#fff;font-size:24px;font-weight:800'), background: g.color }}>{L(k.name).charAt(0)}</span>
                <div style={sx('flex:1;min-width:0')}><h2 style={sx('font-size:21px;font-weight:800')}>{L(k.name)}</h2><span className="msg" style={sx('font-size:15px')}>{ageName(k.age)} · {t.shifts.long[k.shift]}</span></div>
                <button type="button" className="btn btn-ghost" style={sx('min-height:44px;padding:0 12px')} onClick={() => setQr((s) => ({ ...s, [k.id]: !s[k.id] }))} aria-expanded={!!qr[k.id]}><Icon name="qr" size={18} />{ac.qr}</button>
              </div>
              {qr[k.id] && (
                <div style={sx('padding:16px 20px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--line)')}>
                  <div role="img" aria-label={ac.qrAlt} style={sx('width:116px;height:116px;flex:none;border-radius:12px;background:#fff;padding:8px')}>
                    <svg viewBox="0 0 21 21" width="100" height="100" shapeRendering="crispEdges" aria-hidden="true"><rect width="21" height="21" fill="#fff" /><path fill="#0B2A3C" d="M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM8 0h1v2H8zM10 1h2v1h-2zM9 3h2v2H9zM12 4h1v3h-1zM8 6h2v2H8zM8 9h3v1H8zM0 8h2v1H0zM3 9h3v2H3zM12 8h2v2h-2zM15 8h3v1h-3zM19 9h2v2h-2zM9 11h2v2H9zM13 11h3v1h-3zM17 12h2v2h-2zM8 14h2v3H8zM11 14h2v1h-2zM14 14h3v3h-3zM18 15h3v1h-3zM11 17h2v2h-2zM15 18h2v3h-2zM18 18h3v3h-3zM9 19h1v2H9z" /></svg>
                  </div>
                  <p className="msg" style={sx('font-size:15px')}>{ac.qrText}</p>
                </div>
              )}
              <dl style={sx('margin:0;padding:18px 20px;display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
                <div><dt className="msg" style={sx('font-size:13px')}>{ac.nextSession}</dt><dd style={sx('margin:0;font-weight:700')}>{L(k.next)}</dd></div>
                <div><dt className="msg" style={sx('font-size:13px')}>{ac.coach}</dt><dd style={sx('margin:0;font-weight:700')}>{L(k.coach)}</dd></div>
                <div><dt className="msg" style={sx('font-size:13px')}>{ac.attendance}</dt><dd className="num" style={sx('margin:0;font-weight:700')}>{num(k.att[0])} / {num(k.att[1])}</dd></div>
                <div><dt className="msg" style={sx('font-size:13px')}>{ac.status}</dt><dd className="num" style={{ ...sx('margin:0;font-weight:700'), color: k.ok ? 'var(--ok)' : 'var(--coral)' }}>{lang === 'ar' ? `متبقٍ ${num(k.days)} أيام` : `${k.days} days left`}</dd></div>
              </dl>
              <div style={sx('padding:0 20px 16px;display:flex;flex-direction:column;gap:6px')}>
                <div style={sx('display:flex;justify-content:space-between;font-size:14px')}><span className="msg">{progress}</span><strong className="num">{fill(ac.skills, { done: num(k.skills[0]), total: num(k.skills[1]) })}</strong></div>
                <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={progress}><i style={{ width: `${pct}%`, background: g.color }} /></div>
                <p className="msg" style={sx('font-size:15px;margin-top:4px')}>{fill(ac.coachNote, { note: L(k.note) })}</p>
                <div style={sx('display:flex;gap:8px;overflow-x:auto;padding-block:6px;scrollbar-width:none')} aria-label={a.badges}>
                  {ACCOUNT_DATA.badges.map((b) => (
                    <button key={b.id} type="button" onClick={() => setSheet({ type: 'badge', badge: { name: L(b.name), desc: L(b.desc), color: b.color, got: b.got } })}
                      style={{ ...sx('flex:none;width:88px;min-height:96px;border-radius:16px;border:1px solid var(--line);background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:700'), opacity: b.got ? 1 : 0.55 }}>
                      <span style={{ ...sx('width:36px;height:36px;border-radius:50%;color:#fff;display:grid;place-items:center'), background: b.color }}><Icon name="award" size={18} /></span>{L(b.name)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={sx('margin-top:auto;padding:14px 20px 20px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:8px')}>
                <button type="button" className="btn btn-ghost" style={sx('min-height:44px;padding:0 14px')} onClick={() => setAbs(k.id, { open: true, reason: '', status: 'idle' })}>{ac.reportAbsence}</button>
                <button type="button" className="btn btn-ghost" style={sx('min-height:44px;padding:0 14px')} onClick={() => showToast(a.toastMakeup)}>{ac.makeup}</button>
                <button type="button" className="btn btn-ghost" style={sx('min-height:44px;padding:0 14px')} onClick={() => showToast(a.toastFreeze)}>{ac.freeze}</button>
                <Link href="/enroll" className="btn btn-primary" style={sx('min-height:44px;padding:0 14px')}>{ac.renew}</Link>
              </div>
              {ab.open && (
                <form onSubmit={(ev) => submitAbsence(ev, k.id)} noValidate style={sx('margin:0 20px 20px;padding:16px;border-radius:16px;background:var(--bg);border:1px solid var(--line);display:flex;flex-direction:column;gap:10px')}>
                  <label htmlFor={`abs-${k.id}`} className="lbl">{ac.absenceReason}</label>
                  <select id={`abs-${k.id}`} className="sel" value={ab.reason} onChange={(ev) => setAbs(k.id, { reason: ev.target.value, status: 'idle' })} aria-invalid={ab.status === 'invalid'} aria-describedby={`abs-m-${k.id}`} style={ab.status === 'invalid' ? { borderColor: 'var(--bad)' } : undefined}>
                    <option value="">{ac.chooseReason}</option>
                    {Object.entries(ac.reasons).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <span id={`abs-m-${k.id}`} role="status" className="msg" style={{ color: ab.status === 'invalid' ? 'var(--bad)' : ab.status === 'done' ? 'var(--ok)' : 'var(--muted)' }}>{absMsg}</span>
                  <div style={sx('display:flex;gap:8px')}>
                    <button type="submit" className="btn btn-dark" style={sx('min-height:44px')} disabled={ab.status === 'sending'}>{ab.status === 'sending' && <span className="spin dark" />}{ac.send}</button>
                    <button type="button" className="btn-link" onClick={() => setAbs(k.id, { open: false })}>{t.common.close}</button>
                  </div>
                </form>
              )}
            </article>
          );
        })}
      </div>
    );
  } else if (tab === 'payments') {
    panel = (
      <section className="card" style={sx('padding:8px 0')}>
        <div className="tbl-wrap">
          <table style={sx('min-width:640px')}>
            <caption style={sx('text-align:start;padding:12px 16px;font-weight:800;font-size:18px')}>{ac.paymentsTitle}</caption>
            <thead><tr><th scope="col">{ac.colRef}</th><th scope="col">{ac.colDetails}</th><th scope="col">{ac.colAmount}</th><th scope="col">{ac.colStatus}</th><th scope="col"><span className="sr">PDF</span></th></tr></thead>
            <tbody>
              {ACCOUNT_DATA.payments.map((p) => (
                <tr key={p.ref}>
                  <td className="ltr num">{p.ref}</td><td>{L(p.desc)}</td><td className="num" style={sx('font-weight:700;white-space:nowrap')}>{kwd(p.amount)}</td>
                  <td><span className="tag" style={{ background: p.ok ? 'var(--ok-tint)' : 'var(--bad-tint)', color: p.ok ? 'var(--ok-ink)' : 'var(--bad-ink)' }}>{p.ok ? ac.paid : ac.failed}</span></td>
                  <td>{p.ok && <button type="button" className="btn-link" onClick={() => showToast(a.toastInvoice)}>{ac.invoice}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  } else {
    panel = (
      <section style={sx('display:flex;flex-direction:column;gap:10px')}>
        <div style={sx('display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap')}>
          <p className="msg">{ac.swipeDelete}</p>
          <button type="button" className="btn-link" disabled={!unread} onClick={() => { setReadAll(true); showToast(a.toastRead); }}>{ac.markAll}</button>
        </div>
        {!notifs.length && <StateView kind="empty" title={ac.noNotifs} text="" />}
        <ul style={sx('list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px')}>
          {notifs.map((n) => {
            const un = n.unread && !readAll;
            return (
              <li key={n.id} style={sx('position:relative;border-radius:18px;overflow:hidden;background:var(--bad)')}>
                <span aria-hidden="true" style={sx('position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 20px;color:#fff;font-weight:800')}><Icon name="x" size={22} /><Icon name="x" size={22} /></span>
                <SwipeNotif onDelete={() => delNotif(n.id)}>
                  <span aria-hidden="true" style={{ ...sx('width:10px;height:10px;margin-top:9px;flex:none;border-radius:50%'), background: un ? 'var(--coral)' : 'transparent' }} />
                  <div style={sx('flex:1;min-width:0')}>
                    <strong style={{ fontWeight: un ? 800 : 600 }}>{L(n.title)}{un && <span className="sr"> {ac.unread}</span>}</strong>
                    <p className="msg" style={sx('font-size:15px')}>{L(n.body)}</p><span className="msg" style={sx('font-size:13px')}>{L(n.when)}</span>
                  </div>
                  <button type="button" className="icon-btn" style={sx('position:absolute;top:6px;inset-inline-end:6px;border:0;background:transparent')} onClick={() => delNotif(n.id)} aria-label={ac.deleteNotif}><Icon name="x" size={18} /></button>
                </SwipeNotif>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <>
      <PullToRefresh onRefresh={refresh} />
      <div className="wrap" style={sx('padding-block:28px 48px;display:flex;flex-direction:column;gap:22px')}>
        <header style={sx('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:14px')}>
          <div><h1 style={sx('font-size:clamp(28px,3.6vw,40px);font-weight:800')}>{ac.hello}</h1><p className="lead">{ac.lead}</p></div>
          <Link href="/enroll" className="btn btn-primary">{ac.newEnrollment}</Link>
        </header>
        <div role="tablist" aria-label={ac.sections} style={sx('display:flex;gap:6px;overflow-x:auto;border-bottom:1px solid var(--line);scrollbar-width:none')}>
          {TABS.map((id) => (
            <button key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="acct-panel" onClick={() => { setAnim(''); setTab(id); }}
              style={{ ...sx('min-height:48px;padding:0 16px;border:0;background:transparent;font-weight:700;font-size:16px;white-space:nowrap;display:inline-flex;align-items:center;gap:8px'), borderBottom: `3px solid ${tab === id ? 'var(--btn)' : 'transparent'}`, color: tab === id ? 'var(--link)' : 'var(--muted)' }}>
              {ac.tabs[id]}{id === 'notifications' && unread > 0 && <span className="tag num" style={sx('background:var(--coral);color:#fff;border-radius:999px')}>{num(unread)}</span>}
            </button>
          ))}
        </div>
        <p className="msg" style={sx('font-size:13px')}>{ac.swipeTabs}</p>
        <div key={tab} ref={panelRef} id="acct-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className={anim} onTouchStart={tabStart} onTouchMove={tabMove} onTouchEnd={tabEnd} onTouchCancel={tabEnd}>{panel}</div>
      </div>
    </>
  );
}
