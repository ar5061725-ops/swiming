'use client';

import Link from 'next/link';
import { PullToRefresh } from '@/components/PullToRefresh';
import { LoadingGrid, ProgramCard, StateView, StepProgress } from '@/components/ui';
import { useLoader } from '@/hooks/useLoader';
import { usePickProgram } from '@/hooks/usePickProgram';
import { useApp, type Filters } from '@/context/AppContext';
import { AGE_IDS, PROGRAMS, SHIFTS, fill } from '@/lib/domain';
import { sx } from '@/lib/sx';

const SORTERS = {
  soon: (a: (typeof PROGRAMS)[number], b: (typeof PROGRAMS)[number]) => a.round - b.round,
  popular: (a: (typeof PROGRAMS)[number], b: (typeof PROGRAMS)[number]) => b.demand - a.demand,
  seats: (a: (typeof PROGRAMS)[number], b: (typeof PROGRAMS)[number]) => b.seats - a.seats
};

export default function ProgramsPage() {
  const { t, a, num, ageRange, filters: f, setFilter, clearFilters, showToast } = useApp();
  const { status, reload, refresh } = useLoader('programs', 800);
  const pick = usePickProgram();

  const chips = <K extends 'age' | 'shift' | 'gender'>(key: K, opts: [Filters[K], string][]) => (
    <div className="chips-scroll" style={sx('display:flex;flex-wrap:wrap;gap:8px')}>
      {opts.map(([v, l]) => <button key={v} type="button" className="chip" onClick={() => setFilter(key, v)} aria-pressed={f[key] === v}>{l}</button>)}
    </div>
  );

  const items = PROGRAMS
    .filter((p) => (f.age === 'all' || p.age === f.age) && (f.shift === 'all' || p.shift === f.shift) && (f.gender === 'all' || p.gender === f.gender))
    .sort(SORTERS[f.sort]);
  const hasFilters = f.age !== 'all' || f.shift !== 'all' || f.gender !== 'all';

  let body;
  if (status === 'loading') body = <LoadingGrid count={6} min={300} />;
  else if (status === 'error') body = <StateView kind="error" title={t.programs.errorTitle} text={t.programs.errorText} onAct={reload} label={t.common.retry} />;
  else if (!items.length) body = <StateView kind="empty" title={t.programs.emptyTitle} text={t.programs.emptyText} onAct={clearFilters} label={t.programs.clear} extra={<button type="button" className="btn-link" onClick={() => showToast(a.toastNotify)}>{a.toastNotify}</button>} />;
  else body = <div className="grid" style={sx('--min:300px')}>{items.map((p) => <ProgramCard key={p.id} p={p} onPick={pick} />)}</div>;

  const count = status === 'success' ? fill(t.programs.count, { n: num(items.length) }) : status === 'error' ? t.programs.errorTitle : t.programs.loadingCount;

  return (
    <>
      <PullToRefresh onRefresh={refresh} />
      <div className="wrap" style={sx('padding-block:24px 48px;display:flex;flex-direction:column;gap:22px')}>
        <nav aria-label={t.programs.breadcrumb} className="msg" style={sx('font-size:14px')}><Link href="/">{t.nav.home}</Link> / <span aria-current="page">{t.nav.programs}</span></nav>
        <StepProgress cur={1} />
        <header style={sx('display:flex;flex-direction:column;gap:6px')}>
          <h1 style={sx('font-size:clamp(30px,4vw,44px);font-weight:800')}>{t.programs.title}</h1><p className="lead">{t.programs.lead}</p>
        </header>
        <section className="card" aria-label={t.programs.filters} style={sx('padding:18px;display:flex;flex-direction:column;gap:16px')}>
          <div role="group" aria-label={t.programs.age} style={sx('display:flex;flex-direction:column;gap:8px')}>
            <span className="lbl">{t.programs.age}</span>{chips('age', [['all', t.programs.allAges], ...AGE_IDS.map((id) => [id, ageRange(id)] as [Filters['age'], string])])}
          </div>
          <div className="grid" style={sx('--min:240px;align-items:end')}>
            <div role="group" aria-label={t.programs.shift} style={sx('display:flex;flex-direction:column;gap:8px')}>
              <span className="lbl">{t.programs.shift}</span>{chips('shift', [['all', t.programs.all], ...SHIFTS.map((s) => [s, t.shifts.names[s]] as [Filters['shift'], string])])}
            </div>
            <div role="group" aria-label={t.programs.group} style={sx('display:flex;flex-direction:column;gap:8px')}>
              <span className="lbl">{t.programs.group}</span>{chips('gender', [['all', t.programs.all], ['boys', t.gender.boys], ['girls', t.gender.girls]])}
            </div>
            <div className="field">
              <label htmlFor="sort">{t.programs.sort}</label>
              <select id="sort" className="sel" value={f.sort} onChange={(e) => setFilter('sort', e.target.value as Filters['sort'])}>
                <option value="soon">{t.programs.sortSoon}</option><option value="popular">{t.programs.sortPopular}</option><option value="seats">{t.programs.sortSeats}</option>
              </select>
            </div>
          </div>
        </section>
        <div style={sx('display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap')}>
          <p role="status" aria-live="polite" style={sx('font-weight:700')}>{count}</p>
          {hasFilters && <button type="button" className="btn-link" onClick={clearFilters}>{t.programs.clear}</button>}
        </div>
        {body}
      </div>
    </>
  );
}
