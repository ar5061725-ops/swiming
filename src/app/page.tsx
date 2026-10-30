'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { ProgramCard } from '@/components/ui';
import { usePickProgram } from '@/hooks/usePickProgram';
import { useApp } from '@/context/AppContext';
import { AGE_GROUPS, AGE_IDS, PRICE, PROGRAMS, SHIFTS, SHIFT_ICON, fill } from '@/lib/domain';
import { sx } from '@/lib/sx';

const FEATURE_ICONS = ['award', 'users', 'shield', 'tag'] as const;
const UPCOMING = PROGRAMS.filter((p) => ['p1', 'p3', 'p9'].includes(p.id));

export default function HomePage() {
  const { t, lang, num, kwd, ageName, ageRange, alertOpen, closeAlert, setFilter, showToast, a } = useApp();
  const router = useRouter();
  const pick = usePickProgram();
  const [faqOpen, setFaqOpen] = useState(0);

  return (
    <>
      {alertOpen && (
        <div className="n-warn" role="status">
          <div className="wrap" style={sx('display:flex;align-items:center;gap:12px;padding-block:8px')}>
            <Icon name="alert" />
            <p style={sx('flex:1;font-weight:600')}>{t.alert.text}</p>
            <button type="button" className="icon-btn" style={sx('background:transparent;border:0;color:inherit')} onClick={closeAlert} aria-label={t.alert.dismiss}><Icon name="x" size={18} /></button>
          </div>
        </div>
      )}

      <section className="wrap" aria-labelledby="hero-t" style={sx('padding-block:48px 64px;display:grid;gap:40px;align-items:center;grid-template-columns:repeat(auto-fit,minmax(min(440px,100%),1fr))')}>
        <div style={sx('display:flex;flex-direction:column;gap:20px')}>
          <span className="pill" style={sx('align-self:flex-start;background:var(--brand-tint);color:var(--link)')}>{t.brand.tagline}</span>
          <h1 id="hero-t" style={sx('font-size:clamp(34px,5.2vw,60px);font-weight:800;line-height:1.15')}>{t.hero.title}</h1>
          <p className="lead" style={sx('font-size:clamp(17px,1.6vw,20px);max-width:34em')}>{t.hero.lead}</p>
          <div style={sx('display:flex;flex-wrap:wrap;gap:12px')}>
            <Link href="/enroll" className="btn btn-primary btn-lg">{t.hero.cta} <Icon name={lang === 'ar' ? 'fwd' : 'back'} /></Link>
            <Link href="/programs" className="btn btn-ghost btn-lg">{t.hero.secondary}</Link>
          </div>
          <p className="msg" style={sx('display:flex;flex-wrap:wrap;gap:4px 14px;align-items:baseline;font-size:15px')}>
            <span>{t.hero.from} <strong className="num" style={sx('color:var(--ink);font-size:22px')}>{kwd(PRICE)}</strong></span>
            <span>{t.hero.duration}</span><span>{t.hero.hours}</span><span>{t.hero.noHidden}</span>
          </p>
        </div>
        <div style={sx('position:relative;min-height:400px;border-radius:28px;overflow:hidden;background:#0A4D7A')}>
          <svg viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={sx('position:absolute;inset:0;width:100%;height:100%')}>
            <rect width="600" height="440" fill="#0A4D7A" />
            <g stroke="#FFFFFF" strokeOpacity=".35" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round"><path d="M0 110H600" /><path d="M0 200H600" /><path d="M0 290H600" /></g>
            <path d="M0 70 Q75 40 150 70 T300 70 T450 70 T600 70 V0 H0Z" fill="#0E8C98" /><path d="M0 46 Q75 20 150 46 T300 46 T450 46 T600 46 V0 H0Z" fill="#3DB5BF" />
            <circle cx="470" cy="160" r="14" fill="#FFD7C9" /><path d="M440 170 q30 -8 60 0" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M380 172 q20 10 40 0 t40 0" stroke="#7FD3D9" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <div className="card" style={sx('position:absolute;inset-inline:16px;bottom:16px;padding:18px;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow)')}>
            <div style={sx('display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px')}><strong>{t.hero.nextCourse}</strong><span className="msg">{t.hero.starts} <strong style={sx('color:var(--ink)')}>{t.common.placeholderDate}</strong></span></div>
            <div style={sx('display:flex;justify-content:space-between;font-size:14px')}><span className="msg">{t.hero.seatsLeft}</span><strong className="num" style={sx('color:var(--coral)')}>{fill(t.hero.seatsOf, { left: num(14), cap: num(40) })}</strong></div>
            <div className="bar" role="progressbar" aria-label={t.hero.fill} aria-valuemin={0} aria-valuemax={100} aria-valuenow={65}><i style={sx('width:65%;background:var(--coral)')} /></div>
          </div>
        </div>
      </section>

      <section aria-label="features" style={sx('background:var(--card);border-block:1px solid var(--line)')}>
        <ul className="wrap grid" style={sx('--min:220px;list-style:none;padding-block:20px;margin:0 auto')}>
          {t.features.map((f, i) => (
            <li key={f} style={sx('display:flex;align-items:center;gap:12px;font-weight:700')}>
              <span style={sx('width:44px;height:44px;flex:none;border-radius:12px;display:grid;place-items:center;background:var(--brand-tint);color:var(--link)')}><Icon name={FEATURE_ICONS[i]} size={22} /></span>{f}
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap section" aria-labelledby="steps-t">
        <div className="section-head"><h2 id="steps-t" className="h2">{t.steps.title}</h2><p className="lead">{t.steps.lead}</p></div>
        <ol className="grid rail" style={sx('--min:190px;list-style:none;margin:0;padding:0')}>
          {t.steps.items.map((s, i) => (
            <li key={s.title} className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:8px')}>
              <span style={sx('width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--ocean);color:#fff;font-weight:800')}>{num(i + 1)}</span>
              <strong style={sx('font-size:19px')}>{s.title}</strong><span className="msg" style={sx('font-size:15px')}>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="ages-t">
        <div className="section-head"><h2 id="ages-t" className="h2">{t.ages.title}</h2><p className="lead">{t.ages.lead}</p></div>
        <div className="grid rail" style={sx('--min:200px')}>
          {AGE_IDS.map((id) => {
            const g = AGE_GROUPS[id];
            return (
              <Link key={id} href="/programs" onClick={() => setFilter('age', id)} className="card tap" style={{ ...sx('text-decoration:none;color:inherit;padding:20px;display:flex;flex-direction:column;gap:10px'), borderTop: `6px solid ${g.color}` }}>
                <span className="pill" style={{ ...sx('align-self:flex-start;color:var(--ink)'), background: `color-mix(in srgb, ${g.color} 14%, var(--card))` }}>{ageRange(id)} {t.common.years}</span>
                <strong style={sx('font-size:19px')}>{ageName(id)}</strong>
                <span className="msg" style={sx('font-size:15px')}>{t.ages.groups[id].focus}</span>
                <span className="msg" style={sx('margin-top:auto;font-size:14px')}>{fill(t.ages.ratio, { n: num(g.ratio) })}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="shifts-t">
        <div className="section-head"><h2 id="shifts-t" className="h2">{t.shifts.title}</h2><p className="lead">{t.shifts.lead}</p></div>
        <div className="grid rail" style={sx('--min:280px')}>
          {SHIFTS.map((s) => (
            <button key={s} type="button" className="card" onClick={() => { setFilter('shift', s); router.push('/programs'); }} style={sx('padding:24px;display:flex;flex-direction:column;gap:10px;text-align:start')}>
              <span style={sx('width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:var(--brand-tint);color:var(--link)')}><Icon name={SHIFT_ICON[s]} size={26} /></span>
              <span style={sx('font-size:21px;font-weight:800')}>{t.shifts.long[s]}</span><span className="msg">{t.shifts.notes[s]}</span><strong>{t.common.fromTo}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="up-t">
        <div style={sx('display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px')}>
          <h2 id="up-t" className="h2">{t.upcoming.title}</h2>
          <Link href="/programs" style={sx('font-weight:700;min-height:44px;display:inline-flex;align-items:center')}>{t.upcoming.all}</Link>
        </div>
        <div className="grid rail" style={sx('--min:300px')}>{UPCOMING.map((p) => <ProgramCard key={p.id} p={p} onPick={pick} />)}</div>
      </section>

      <section className="wrap section" aria-labelledby="fam-t">
        <div style={sx('background:var(--coral-tint);border-radius:28px;padding:clamp(24px,4vw,48px);display:grid;gap:28px;align-items:center;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))')}>
          <div style={sx('display:flex;flex-direction:column;gap:14px')}>
            <h2 id="fam-t" className="h2" style={sx('color:var(--coral-ink)')}>{t.family.title}</h2>
            <p style={sx('color:var(--coral-ink);font-size:17px')}>{t.family.lead}</p>
            <div style={sx('display:flex;flex-wrap:wrap;gap:10px')}>
              <span className="pill" style={sx('background:var(--card);color:var(--ink);padding:10px 16px')}>{t.family.two}</span>
              <span className="pill" style={sx('background:var(--card);color:var(--ink);padding:10px 16px')}>{t.family.three}</span>
            </div>
          </div>
          <div className="card" style={sx('padding:22px;display:flex;flex-direction:column;gap:10px')}>
            <span className="msg">{t.family.example}</span>
            <div style={sx('display:flex;justify-content:space-between')}><span className="num">{num(2)} × {kwd(PRICE)}</span><s className="msg num">{kwd(240)}</s></div>
            <div style={sx('display:flex;justify-content:space-between;color:var(--ok);font-weight:700')}><span>{t.family.sibling}</span><span className="num">− {kwd(24)}</span></div>
            <div style={sx('height:1px;background:var(--line)')} />
            <div style={sx('display:flex;justify-content:space-between;align-items:baseline')}><strong>{t.family.total}</strong><strong className="num" style={sx('font-size:26px')}>{kwd(216)}</strong></div>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="safe-t" id="safety">
        <div className="section-head"><h2 id="safe-t" className="h2">{t.safety.title}</h2><p className="lead">{t.safety.lead}</p></div>
        <ul className="grid" style={sx('--min:250px;list-style:none;margin:0;padding:0')}>
          {t.safety.items.map((s) => (
            <li key={s} className="card" style={sx('padding:14px 16px;display:flex;gap:10px;align-items:flex-start;border-radius:16px')}>
              <span style={sx('color:var(--ok);flex:none;margin-top:2px')}><Icon name="check" stroke={2.6} /></span>{s}
            </li>
          ))}
        </ul>
        <button type="button" className="btn-link" style={sx('align-self:flex-start')} onClick={() => showToast(a.toastPolicy)}>{t.safety.policy}</button>
      </section>

      <section className="wrap section" aria-labelledby="voices-t">
        <h2 id="voices-t" className="h2">{t.voices.title}</h2>
        <div className="grid rail" style={sx('--min:280px')}>
          {[1, 2, 3].map((n) => (
            <figure key={n} className="card" style={sx('margin:0;padding:22px;border-style:dashed;display:flex;flex-direction:column;gap:10px')}>
              <blockquote style={sx('margin:0;font-size:17px')}>{t.voices.placeholder}</blockquote><figcaption className="msg">{t.voices.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="faq-t" style={sx('max-width:860px')}>
        <h2 id="faq-t" className="h2">{t.faq.title}</h2>
        <div style={sx('display:flex;flex-direction:column;gap:10px')}>
          {t.faq.items.map((f, i) => {
            const open = faqOpen === i;
            return (
              <div key={f.q} className="card" style={sx('border-radius:16px;overflow:hidden')}>
                <h3>
                  <button type="button" onClick={() => setFaqOpen(open ? -1 : i)} aria-expanded={open} aria-controls={`faq-${i}`} style={sx('width:100%;min-height:56px;padding:14px 18px;border:0;background:transparent;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:17px;font-weight:700;text-align:start')}>
                    {f.q}
                    <span style={{ flex: 'none', transition: 'transform .2s', transform: `rotate(${open ? 180 : 0}deg)` }}><Icon name="chev" stroke={2.2} /></span>
                  </button>
                </h3>
                {open && <div id={`faq-${i}`} className="msg" style={sx('padding:0 18px 18px;font-size:16px')}>{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap" style={sx('padding-block:24px 64px')}>
        <div style={sx('background:var(--ocean);color:#fff;border-radius:28px;padding:clamp(28px,5vw,52px);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:20px')}>
          <div style={sx('display:flex;flex-direction:column;gap:8px;max-width:560px')}><h2 className="h2">{t.cta.title}</h2><p style={sx('color:var(--ocean-ink);font-size:17px')}>{t.cta.lead}</p></div>
          <Link href="/enroll" className="btn btn-lg" style={sx('background:#fff;color:#0A4D7A')}>{t.hero.cta}</Link>
        </div>
      </section>
    </>
  );
}
