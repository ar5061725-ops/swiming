'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/Icon';
import { buzz, useApp } from '@/context/AppContext';
import { useLoader } from '@/hooks/useLoader';
import { ADMIN_ROWS, type AdminRowStatus } from '@/lib/data';
import { SHIFTS, fakeApi, fill, type ShiftId } from '@/lib/domain';
import { sx } from '@/lib/sx';

type Scope = 'all' | ShiftId;
type Closure = { open: boolean; scope: Scope; msg: string | null; status: 'editing' | 'sending' | 'done' | 'error'; error: string };
const AFFECTED: Record<Scope, number> = { all: 248, morning: 92, evening: 101, night: 55 };
const SECTIONS = {
  ar: [['dash', 'لوحة المؤشرات'], ['programs', 'البرامج والدورات'], ['groups', 'المجموعات والتوزيع'], ['coaches', 'المدربون'], ['parents', 'أولياء الأمور'], ['payments', 'المدفوعات والاسترجاع'], ['attendance', 'الحضور والتعويض'], ['settings', 'الإعدادات']],
  en: [['dash', 'Dashboard'], ['programs', 'Programs & courses'], ['groups', 'Groups'], ['coaches', 'Coaches'], ['parents', 'Parents'], ['payments', 'Payments & refunds'], ['attendance', 'Attendance'], ['settings', 'Settings']]
};

export default function AdminPage() {
  const { t, a, lang, num, kwd, ageName, L, showToast, codes, setCode } = useApp();
  const ad = t.admin;
  const { status } = useLoader('admin', 700);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | AdminRowStatus>('all');
  const [section, setSection] = useState('dash');
  const [c, setC] = useState<Closure>({ open: false, scope: 'all', msg: null, status: 'editing', error: '' });

  const affected = AFFECTED[c.scope];
  const q = query.trim().toLowerCase();
  const rows = ADMIN_ROWS.filter((r) => (filter === 'all' || r[6] === filter) && (!q || r[0].toLowerCase().includes(q) || L(r[1]).toLowerCase().includes(q)));
  const stat: Record<AdminRowStatus, [string, string, string]> = { paid: [ad.paid, 'var(--ok-tint)', 'var(--ok-ink)'], pending: [ad.pending, 'var(--warn-tint)', 'var(--warn-ink)'], failed: [ad.failed, 'var(--bad-tint)', 'var(--bad-ink)'] };
  const pc = lang === 'ar' ? '٪' : '%';
  const kpis: [string, string, string, string][] = [
    [ad.kpiRevenue, kwd(1452), lang === 'ar' ? '+١٨٪ عن أمس' : '+18% vs yesterday', 'var(--ok)'],
    [ad.kpiSignups, num(14), lang === 'ar' ? '+٣ عن أمس' : '+3 vs yesterday', 'var(--ok)'],
    [ad.kpiOccupancy, num(78) + pc, `${t.shifts.names.night} ${num(92)}${pc}`, 'var(--coral)'],
    [ad.kpiWaitlist, num(23), `${num(9)} · ${ageName('a5')}`, 'var(--muted)']
  ];
  const occ: [ShiftId, number, number, string][] = [['morning', 51, 80, 'var(--btn)'], ['evening', 79, 100, '#1D5FA8'], ['night', 44, 48, 'var(--coral)']];
  const funnel = t.steps.items.map((s, i) => [s.title, [100, 46, 31, 19, 16][i], [1200, 552, 372, 228, 192][i]] as const);

  const submitClosure = (ev: FormEvent) => {
    ev.preventDefault();
    const msg = c.msg == null ? ad.defaultMessage : c.msg;
    if (msg.trim().length < 10) { setC({ ...c, error: ad.messageTooShort }); return; }
    setC({ ...c, status: 'sending', error: '' });
    fakeApi(true, 1000).then(() => { setC((s) => ({ ...s, status: 'done' })); buzz(); });
  };

  const tableBody = status !== 'success'
    ? <div aria-busy="true" style={sx('display:flex;flex-direction:column;gap:10px')}>{[0, 1, 2].map((i) => <div key={i} className="skel" style={sx('height:40px')} />)}</div>
    : !rows.length ? <p role="status" className="msg" style={sx('padding:24px;text-align:center')}>{ad.noRows}</p>
    : (
      <div className="tbl-wrap">
        <table style={sx('min-width:720px')}>
          <thead><tr><th scope="col">{ad.colOrder}</th><th scope="col">{ad.colParent}</th><th scope="col">{ad.colKids}</th><th scope="col">{ad.colProgram}</th><th scope="col">{ad.colAmount}</th><th scope="col">{ad.colStatus}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                <td className="ltr num">{r[0]}</td><td style={sx('font-weight:700')}>{L(r[1])}</td><td className="num">{num(r[2])}</td>
                <td>{ageName(r[3])} · {t.shifts.names[r[4]]}</td><td className="num" style={sx('white-space:nowrap')}>{kwd(r[5])}</td>
                <td><span className="tag" style={{ background: stat[r[6]][1], color: stat[r[6]][2] }}>{stat[r[6]][0]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="wrap adm">
      <nav className="adm-nav" aria-label={ad.menu}>
        {SECTIONS[lang].map(([id, l]) => (
          <button key={id} type="button" aria-current={section === id ? 'page' : undefined} onClick={() => { if (id !== 'dash') showToast(a.toastSection); setSection('dash'); }}>{l}</button>
        ))}
        <p className="adm-role" style={sx('font-size:13px;opacity:.8;padding:12px 8px 0')}>{ad.role}</p>
      </nav>
      <div className="adm-main">
        <header style={sx('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px')}>
          <div><h1 style={sx('font-size:clamp(24px,3vw,32px);font-weight:800')}>{ad.title}</h1><p className="msg">{ad.updated}</p></div>
          <button type="button" className="btn btn-danger" onClick={() => setC({ open: true, scope: 'all', msg: null, status: 'editing', error: '' })}><Icon name="alert" size={18} />{ad.emergency}</button>
        </header>

        {c.open && (
          <form onSubmit={submitClosure} noValidate className="card" aria-labelledby="cl-t" style={sx('padding:20px;border:2px solid var(--bad);display:flex;flex-direction:column;gap:12px')}>
            <h2 id="cl-t" style={sx('font-size:20px;font-weight:800;color:var(--bad)')}>{ad.emergencyTitle}</h2>
            {c.status === 'done' ? (
              <>
                <p role="status" className="notice n-ok">{fill(ad.closureDone, { n: num(affected) })}</p>
                <button type="button" className="btn btn-ghost" onClick={() => setC({ ...c, open: false })}>{t.common.close}</button>
              </>
            ) : (
              <>
                {c.status === 'error' && <p role="alert" className="notice n-bad">{ad.closureError}</p>}
                <div className="field"><label htmlFor="cl-scope">{ad.scope}</label>
                  <select id="cl-scope" className="sel" value={c.scope} onChange={(ev) => setC({ ...c, scope: ev.target.value as Scope })}>
                    <option value="all">{ad.scopeAll}</option>{SHIFTS.map((s) => <option key={s} value={s}>{t.shifts.long[s]}</option>)}
                  </select></div>
                <div className="field"><label htmlFor="cl-msg">{ad.message}</label>
                  <div className={`ctl ${c.error ? 'err' : ''}`}><textarea id="cl-msg" rows={3} value={c.msg == null ? ad.defaultMessage : c.msg} onChange={(ev) => setC({ ...c, msg: ev.target.value, error: '' })} aria-invalid={!!c.error} aria-describedby="cl-m" /></div>
                  <span id="cl-m" className="msg err">{c.error}</span></div>
                <p className="msg">{fill(ad.willNotify, { n: num(affected) })}</p>
                <div style={sx('display:flex;flex-wrap:wrap;gap:8px')}>
                  <button type="submit" className="btn btn-danger" disabled={c.status === 'sending'}>{c.status === 'sending' && <span className="spin" />}{ad.confirm}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setC({ ...c, open: false })} disabled={c.status === 'sending'}>{ad.cancel}</button>
                </div>
              </>
            )}
          </form>
        )}

        <section className="grid" style={sx('--min:190px;gap:12px')} aria-label="KPI">
          {kpis.map(([l, v, d, col]) => (
            <div key={l} className="card" style={sx('padding:18px;display:flex;flex-direction:column;gap:2px')}>
              <span className="msg" style={sx('font-weight:700;font-size:14px')}>{l}</span><strong className="num" style={sx('font-size:28px;font-weight:800')}>{v}</strong><span style={{ fontSize: 14, color: col }}>{d}</span>
            </div>
          ))}
        </section>

        <div className="grid" style={sx('--min:340px')}>
          <section className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:12px')} aria-labelledby="occ-t">
            <h2 id="occ-t" style={sx('font-size:18px;font-weight:800')}>{ad.occupancy}</h2>
            {occ.map(([s, x, y, col]) => {
              const p = Math.round((x / y) * 100);
              return (
                <div key={s} style={sx('display:flex;flex-direction:column;gap:6px')}>
                  <div style={sx('display:flex;justify-content:space-between')}><span style={sx('font-weight:700')}>{t.shifts.long[s]}</span><span className="num">{num(x)} / {num(y)}</span></div>
                  <div className="bar" role="progressbar" aria-label={t.shifts.long[s]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p} style={sx('height:12px')}><i style={{ width: `${p}%`, background: col }} /></div>
                </div>
              );
            })}
            <p className="msg" style={sx('font-size:14px')}>{ad.occupancyHint}</p>
          </section>
          <section className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:10px')} aria-labelledby="fun-t">
            <h2 id="fun-t" style={sx('font-size:18px;font-weight:800')}>{ad.funnel}</h2>
            {funnel.map(([l, p, v]) => (
              <div key={l} style={sx('display:grid;grid-template-columns:72px minmax(0,1fr) 60px;align-items:center;gap:10px;font-size:15px')}>
                <span style={sx('font-weight:700')}>{l}</span>
                <div style={sx('height:22px;border-radius:6px;background:var(--bg);overflow:hidden')}><div style={{ height: '100%', width: `${p}%`, background: 'var(--btn)' }} /></div>
                <span className="num" style={sx('text-align:end')}>{num(v)}</span>
              </div>
            ))}
            <p className="msg" style={sx('font-size:14px')}>{ad.funnelHint}</p>
          </section>
        </div>

        <section className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:14px')} aria-labelledby="reg-t">
          <div style={sx('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:10px')}>
            <h2 id="reg-t" style={sx('font-size:18px;font-weight:800')}>{ad.registrations}</h2>
            <div style={sx('display:flex;flex-wrap:wrap;gap:8px')}>
              <label htmlFor="adm-q" className="sr">{ad.search}</label>
              <div className="ctl" style={sx('min-width:min(240px,100%)')}><input id="adm-q" type="search" placeholder={ad.search} value={query} onChange={(ev) => setQuery(ev.target.value)} style={sx('min-height:44px')} /></div>
              <label htmlFor="adm-f" className="sr">{ad.colStatus}</label>
              <select id="adm-f" className="sel" style={sx('width:auto;min-height:44px')} value={filter} onChange={(ev) => setFilter(ev.target.value as 'all' | AdminRowStatus)}>
                <option value="all">{ad.allStatuses}</option>{(['paid', 'pending', 'failed'] as const).map((s) => <option key={s} value={s}>{stat[s][0]}</option>)}
              </select>
              <button type="button" className="btn btn-ghost" style={sx('min-height:44px')} onClick={() => showToast(a.toastExport)}>{ad.export}</button>
            </div>
          </div>
          {tableBody}
        </section>

        <section className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:10px')} aria-labelledby="codes-t">
          <h2 id="codes-t" style={sx('font-size:18px;font-weight:800')}>{ad.codes}</h2>
          {Object.keys(codes).map((code) => (
            <label key={code} className="tap" style={sx('display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-radius:12px;background:var(--bg);cursor:pointer')}>
              <strong className="ltr">{code}</strong>
              <span style={sx('display:inline-flex;align-items:center;gap:8px;font-weight:700;min-height:44px')}>
                <input type="checkbox" checked={codes[code]} onChange={(ev) => { setCode(code, ev.target.checked); showToast(fill(ev.target.checked ? a.toastCodeOn : a.toastCodeOff, { code })); }} style={sx('width:22px;height:22px;accent-color:var(--btn)')} />
                {codes[code] ? ad.active : ad.inactive}
              </span>
            </label>
          ))}
        </section>
      </div>
    </div>
  );
}
