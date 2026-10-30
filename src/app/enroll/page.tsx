'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Field, OrderSummary, StepProgress } from '@/components/ui';
import { buzz, newKid, useApp, type EnrollState } from '@/context/AppContext';
import { AGE_IDS, SEAT_MAP, SHIFTS, SHIFT_ICON, ageOn, fakeApi, fill, firstOpenShift, groupFor, quote, validateEnrollment, type AgeId, type Gender, type Kid, type Level, type ShiftId } from '@/lib/domain';
import { sx } from '@/lib/sx';

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export default function EnrollPage() {
  const { t, a, lang, num, kwd, ageName, ageRange, enroll: E, setEnroll, resetEnroll, startHold, showToast, demo, codes } = useApp();
  const e = t.enroll;

  // Seat-hold countdown derived from an end timestamp; ticks locally so the rest of the app is not re-rendered.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (E.step === 'done') return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [E.step]);
  const hold = E.holdEnd && now ? Math.max(0, Math.ceil((E.holdEnd - now) / 1000)) : demo.shortHold ? 30 : 600;

  const patch = (p: Partial<EnrollState>) => setEnroll((s) => ({ ...s, ...p }));
  const patchKid = (id: number, p: Partial<Kid>) => setEnroll((s) => ({ ...s, kids: s.kids.map((k) => (k.id === id ? { ...k, ...p } : k)) }));
  const clearError = (key: string) => setEnroll((s) => { if (!s.errors[key]) return s; const { [key]: _drop, ...rest } = s.errors; return { ...s, errors: rest }; });
  const scrollTop = () => window.scrollTo(0, 0);

  if (E.step === 'done') {
    return (
      <div className="wrap" style={sx('padding-block:32px 64px')}>
        <section role="status" aria-labelledby="done-t" style={sx('max-width:760px;margin:0 auto;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px')}>
          <StepProgress cur={6} />
          <span style={{ ...sx('width:88px;height:88px;border-radius:50%;background:var(--ok);color:#fff;display:grid;place-items:center'), animation: 'pop .45s ease-out' }}><Icon name="check" size={44} stroke={2.6} /></span>
          <h1 id="done-t" style={sx('font-size:clamp(28px,4vw,42px);font-weight:800')}>{e.successTitle}</h1><p className="lead">{e.successLead}</p>
          <p className="card" style={sx('padding:10px 18px;font-weight:700')}>{e.orderRef} <span className="ltr num">{E.ref}</span></p>
          <div className="grid" style={sx('--min:220px;width:100%;text-align:start')}>
            <div className="card" style={sx('padding:18px')}><strong>{e.whenWhere}</strong><p className="msg">{e.whenWhereValue}</p></div>
            <div className="card" style={sx('padding:18px')}><strong>{e.bring}</strong><p className="msg">{e.bringValue}</p></div>
          </div>
          <div style={sx('display:flex;flex-wrap:wrap;gap:10px;justify-content:center')}>
            <button type="button" className="btn btn-ghost" onClick={() => showToast(a.toastCalendar)}>{e.addCalendar}</button>
            <button type="button" className="btn btn-ghost" onClick={() => showToast(a.linkCopied)}><Icon name="share" size={18} />{a.share}</button>
            <Link href="/account" className="btn btn-primary" onClick={resetEnroll}>{e.goAccount}</Link>
          </div>
        </section>
      </div>
    );
  }

  const step = E.step;
  const q = quote(E.kids.length, E.promo.status === 'valid' ? E.promo.pct : 0);
  const showDiscount = step >= 4;
  const expired = hold <= 0;
  const lines = E.kids.map((k, i) => ({ title: `${k.name.trim() || fill(e.child, { n: num(i + 1) })} · ${ageName(k.age)}`, sub: `${ageRange(k.age)} ${t.common.years} · ${t.shifts.names[k.shift]} · ${fill(t.program.round, { n: num(k.round) })}` }));
  const errCount = Object.keys(E.errors).length;
  const err = (k: string) => E.errors[k];
  const paying = E.pay.status === 'processing';

  const addKid = () => {
    if (E.kids.length >= 4) return;
    setEnroll((s) => ({ ...s, kids: [...s.kids, newKid(s.nextId)], nextId: s.nextId + 1 }));
    showToast(a.toastAdded);
  };
  const removeKid = (id: number) => { setEnroll((s) => ({ ...s, kids: s.kids.filter((k) => k.id !== id) })); showToast(a.toastRemoved); };
  const alignShifts = () => {
    const target = E.kids[0].shift;
    setEnroll((s) => ({ ...s, kids: s.kids.map((k) => ((SEAT_MAP[k.age][target] || 0) > 0 ? { ...k, shift: target } : k)) }));
    showToast(a.toastAligned);
  };
  const fixGroup = (k: Kid) => {
    const g = groupFor(ageOn(k.dob));
    if (g && g !== 'out') { patchKid(k.id, { age: g, shift: firstOpenShift(g, k.shift) }); clearError(`kid.${k.id}.dob`); }
  };
  const stepBack = () => { if (step > 2) { patch({ step: (step - 1) as 2 | 3 | 4 }); scrollTop(); } };
  const stepNext = () => {
    if (expired) return;
    if (step === 3) {
      const errors = validateEnrollment(E.parent, E.kids, E.terms);
      patch({ errors });
      if (Object.keys(errors).length) {
        requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
        return;
      }
    }
    patch({ step: (step + 1) as 3 | 4 | 5 }); scrollTop(); document.getElementById('view')?.focus({ preventScroll: true });
  };
  const pay = () => {
    if (paying || expired) return;
    setEnroll((s) => ({ ...s, pay: { ...s.pay, status: 'processing', error: '' } }));
    const fail = demo.payFail && E.pay.attempts === 0;
    fakeApi(() => 'MJ-' + Math.floor(100000 + Math.random() * 900000), 1500, fail)
      .then((ref) => { setEnroll((s) => ({ ...s, ref, step: 'done', pay: { ...s.pay, status: 'idle' } })); buzz(); })
      .catch(() => setEnroll((s) => ({ ...s, pay: { status: 'failed', attempts: s.pay.attempts + 1, error: t.enroll.payDeclined } })))
      .finally(scrollTop);
  };
  const applyPromo = (ev: FormEvent) => {
    ev.preventDefault();
    const code = E.promo.code.trim().toUpperCase();
    if (!code) { patch({ promo: { ...E.promo, status: 'empty' } }); return; }
    patch({ promo: { ...E.promo, status: 'checking' } });
    // Server rule mirror: only active codes validate.
    fakeApi(() => (code === 'WELCOME' && codes.WELCOME ? 5 : 0), 700)
      .then((pct) => setEnroll((s) => ({ ...s, promo: pct ? { ...s.promo, status: 'valid', pct, applied: code } : { ...s.promo, status: 'invalid', pct: 0, applied: '' } })))
      .catch(() => setEnroll((s) => ({ ...s, promo: { ...s.promo, status: 'error' } })));
  };

  const parentField = (id: string, key: keyof EnrollState['parent'], rest: Omit<Parameters<typeof Field>[0], 'id' | 'value' | 'onChange' | 'error'>) => (
    <Field id={id} value={E.parent[key]} error={err(`parent.${key}`)} {...rest}
      onChange={(v) => { setEnroll((s) => ({ ...s, parent: { ...s.parent, [key]: v } })); clearError(`parent.${key}`); }} />
  );

  let stepHtml: React.ReactNode = null;
  if (step === 2) {
    const shiftsUsed = new Set(E.kids.map((k) => k.shift));
    stepHtml = (
      <section aria-labelledby="st-t" style={sx('display:flex;flex-direction:column;gap:16px')}>
        <header><h1 id="st-t" style={sx('font-size:clamp(26px,3.4vw,36px);font-weight:800')}>{e.pickTitle}</h1><p className="lead">{e.pickLead}</p></header>
        {E.kids.map((k, i) => (
          <fieldset key={k.id} className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:18px')}>
            <legend>{fill(e.child, { n: num(i + 1) })}</legend>
            {E.kids.length > 1 && <button type="button" className="btn-link" style={sx('align-self:flex-start;color:var(--bad)')} onClick={() => removeKid(k.id)}>{e.removeChild}</button>}
            <div className="grid" style={sx('--min:200px')}>
              <div className="field"><label htmlFor={`k${k.id}-age`}>{e.ageGroup}</label>
                <select id={`k${k.id}-age`} className="sel" value={k.age} onChange={(ev) => { const age = ev.target.value as AgeId; patchKid(k.id, { age, shift: firstOpenShift(age, k.shift) }); }}>
                  {AGE_IDS.map((id) => <option key={id} value={id}>{ageRange(id)} · {ageName(id)}</option>)}
                </select></div>
              <div className="field" role="group" aria-labelledby={`k${k.id}-g`}><span id={`k${k.id}-g`} className="lbl">{e.group}</span>
                <div style={sx('display:flex;gap:8px')}>
                  {(['boys', 'girls'] as Gender[]).map((g) => <button key={g} type="button" className="chip" style={sx('flex:1;border-radius:12px;min-height:48px')} onClick={() => patchKid(k.id, { gender: g })} aria-pressed={k.gender === g}>{t.gender[g]}</button>)}
                </div></div>
              <div className="field"><label htmlFor={`k${k.id}-r`}>{e.startDate}</label>
                <select id={`k${k.id}-r`} className="sel" value={k.round} onChange={(ev) => patchKid(k.id, { round: Number(ev.target.value) })}>
                  {[1, 2, 3].map((r) => <option key={r} value={r}>{fill(t.program.round, { n: num(r) })} · {t.common.placeholderDate}</option>)}
                </select></div>
            </div>
            <div role="group" aria-labelledby={`k${k.id}-s`} style={sx('display:flex;flex-direction:column;gap:8px')}>
              <span id={`k${k.id}-s`} className="lbl">{e.shiftLabel}</span>
              <div className="grid" style={sx('--min:170px;gap:10px')}>
                {SHIFTS.map((s: ShiftId) => {
                  const left = SEAT_MAP[k.age][s];
                  const dis = !(left && left > 0), on = k.shift === s && !dis;
                  const note = left === null ? e.shiftUnavailable : left === 0 ? e.shiftFull : fill(left <= 3 ? e.shiftFew : e.shiftSeats, { n: num(left) });
                  return (
                    <button key={s} type="button" disabled={dis} aria-pressed={on} onClick={() => patchKid(k.id, { shift: s })}
                      style={{ ...sx('min-height:76px;padding:12px 14px;border-radius:14px;display:flex;flex-direction:column;gap:2px;text-align:start'), border: `2px solid ${on ? 'var(--btn)' : 'var(--line)'}`, background: on ? 'var(--brand-tint)' : dis ? 'var(--bg)' : 'var(--card)' }}>
                      <span style={sx('display:flex;align-items:center;gap:8px;font-weight:800')}><Icon name={SHIFT_ICON[s]} size={18} />{t.shifts.names[s]}</span>
                      <span className="msg" style={sx('font-size:14px')}>{note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </fieldset>
        ))}
        {E.kids.length > 1 && shiftsUsed.size > 1 && (
          <div className="notice n-info" role="note"><span>{e.siblingShiftHint}</span><button type="button" className="btn btn-ghost" style={sx('min-height:44px')} onClick={alignShifts}>{e.alignShifts}</button></div>
        )}
        {E.kids.length < 4 && <button type="button" onClick={addKid} style={sx('min-height:54px;border-radius:16px;border:2px dashed var(--field);background:transparent;color:var(--link);font-weight:800;font-size:16px')}>{e.addChild}</button>}
      </section>
    );
  } else if (step === 3) {
    stepHtml = (
      <section aria-labelledby="st-t" style={sx('display:flex;flex-direction:column;gap:16px')}>
        <header><h1 id="st-t" style={sx('font-size:clamp(26px,3.4vw,36px);font-weight:800')}>{e.detailsTitle}</h1><p className="lead">{e.detailsLead}</p></header>
        {errCount > 0 && <div className="notice n-bad" role="alert">{fill(e.errorSummary, { n: num(errCount) })}</div>}
        <fieldset className="card grid" style={sx('--min:250px;padding:20px')}>
          <legend>{e.parent}</legend>
          {parentField('p-name', 'name', { label: e.fullName, autoComplete: 'name' })}
          {parentField('p-phone', 'phone', { label: e.mobile, type: 'tel', inputMode: 'numeric', autoComplete: 'tel-national', prefix: '+965', ltr: true, placeholder: '5XXXXXXX', hint: e.mobileHint })}
          {parentField('p-email', 'email', { label: e.email, type: 'email', inputMode: 'email', autoComplete: 'email', ltr: true, hint: e.emailHint })}
          {parentField('p-emn', 'emergencyName', { label: e.emergencyName, placeholder: e.emergencyNamePh })}
          {parentField('p-emp', 'emergencyPhone', { label: e.emergencyPhone, type: 'tel', inputMode: 'numeric', prefix: '+965', ltr: true, placeholder: '5XXXXXXX' })}
        </fieldset>
        {E.kids.map((k, i) => {
          const y = ageOn(k.dob), g = groupFor(y), mismatch = g && g !== 'out' && g !== k.age;
          return (
            <fieldset key={k.id} className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:16px')}>
              <legend>{fill(e.child, { n: num(i + 1) })} · {ageName(k.age)} · {t.shifts.names[k.shift]}</legend>
              <div className="grid" style={sx('--min:250px')}>
                <Field id={`k${k.id}-name`} label={e.childName} value={k.name} error={err(`kid.${k.id}.name`)} onChange={(v) => { patchKid(k.id, { name: v }); clearError(`kid.${k.id}.name`); }} />
                <Field id={`k${k.id}-dob`} label={e.dob} type="date" value={k.dob} error={err(`kid.${k.id}.dob`)} hint={g && g !== 'out' ? fill(e.dobDetected, { age: num(y!), range: ageRange(g) }) : e.dobHint} onChange={(v) => { patchKid(k.id, { dob: v }); clearError(`kid.${k.id}.dob`); }} />
                <div className="field"><label htmlFor={`k${k.id}-lv`}>{e.level}</label>
                  <select id={`k${k.id}-lv`} className="sel" value={k.level} onChange={(ev) => patchKid(k.id, { level: ev.target.value as Level })}>
                    {(['beginner', 'intermediate', 'advanced'] as Level[]).map((l) => <option key={l} value={l}>{e.levels[l]}</option>)}
                  </select></div>
              </div>
              {mismatch && (
                <div className="notice n-warn" role="alert"><span>{fill(e.mismatch, { range: ageRange(g), name: ageName(g) })}</span><button type="button" className="btn btn-dark" style={sx('min-height:44px')} onClick={() => fixGroup(k)}>{e.fixGroup}</button></div>
              )}
              <label className="check"><input type="checkbox" checked={k.fear} onChange={(ev) => patchKid(k.id, { fear: ev.target.checked })} /><span>{e.fear}</span></label>
              <Field id={`k${k.id}-notes`} label={e.health} value={k.notes} multiline optional hint={e.healthHint} onChange={(v) => patchKid(k.id, { notes: v })} />
            </fieldset>
          );
        })}
        <fieldset className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:8px')}>
          <legend>{e.consents}</legend>
          <label className="check"><input type="checkbox" checked={E.terms} onChange={(ev) => { patch({ terms: ev.target.checked }); clearError('terms'); }} aria-invalid={!!err('terms')} aria-describedby="terms-m" /><span>{e.terms} <span className="req" style={sx('color:var(--bad)')} aria-hidden="true">*</span></span></label>
          <span id="terms-m" className="msg err">{err('terms') ? t.errors[err('terms')] : ''}</span>
          <label className="check"><input type="checkbox" checked={E.photo} onChange={(ev) => patch({ photo: ev.target.checked })} /><span>{e.photo}</span></label>
        </fieldset>
      </section>
    );
  } else if (step === 4) {
    const pr = E.promo, n = E.kids.length;
    const pmsg = { idle: [e.promoHint, 'var(--muted)'], empty: [e.promoEmpty, 'var(--bad)'], checking: [e.promoChecking, 'var(--muted)'], invalid: [e.promoInvalid, 'var(--bad)'], error: [e.promoError, 'var(--bad)'],
      valid: [q.source === 'promo' ? fill(e.promoValid, { code: pr.applied, pct: num(pr.pct) }) : e.promoLower, 'var(--ok)'] }[pr.status];
    const promoErr = pr.status === 'invalid' || pr.status === 'empty';
    stepHtml = (
      <section aria-labelledby="st-t" style={sx('display:flex;flex-direction:column;gap:16px')}>
        <header><h1 id="st-t" style={sx('font-size:clamp(26px,3.4vw,36px);font-weight:800')}>{e.discountTitle}</h1><p className="lead">{e.discountLead}</p></header>
        <div style={{ ...sx('border-radius:22px;padding:24px;display:flex;flex-direction:column;gap:6px'), background: q.pct ? 'var(--ok-tint)' : 'var(--card)', color: q.pct ? 'var(--ok-ink)' : 'var(--ink)', border: `1px solid ${q.pct ? 'transparent' : 'var(--line)'}`, animation: 'pop .35s ease-out' }}>
          <strong style={sx('font-size:24px;font-weight:800')}>{q.pct ? fill(e.saved, { amount: kwd(q.discount) }) : e.noDiscount}</strong>
          <span>{q.source === 'sibling' ? fill(e.siblingReward, { pct: num(q.sib), n: num(n) }) : q.source === 'promo' ? fill(e.promoReward, { code: pr.applied }) : e.noDiscountText}</span>
        </div>
        {n < 3 && (
          <div className="notice card" style={sx('font-weight:500')}><span>{n === 2 ? e.suggestThird : e.suggestSecond}</span>
            <button type="button" className="btn btn-ghost" style={sx('min-height:44px')} onClick={() => { addKid(); patch({ step: 2 }); scrollTop(); }}>{e.addChildShort}</button></div>
        )}
        <form onSubmit={applyPromo} className="card" style={sx('padding:20px;display:flex;flex-direction:column;gap:8px')} noValidate>
          <label htmlFor="promo" className="lbl">{e.promoLabel}</label>
          <div style={sx('display:flex;gap:8px;flex-wrap:wrap')}>
            <div className={`ctl ${promoErr ? 'err' : ''}`} style={sx('flex:1 1 200px')} dir="ltr">
              <input id="promo" value={pr.code} onChange={(ev) => setEnroll((s) => ({ ...s, promo: { ...s.promo, code: ev.target.value, status: s.promo.status === 'checking' ? 'checking' : 'idle' } }))} autoComplete="off" autoCapitalize="characters" aria-describedby="promo-m" aria-invalid={promoErr} style={sx('text-transform:uppercase')} />
            </div>
            <button type="submit" className="btn btn-dark" disabled={pr.status === 'checking'}>{pr.status === 'checking' && <span className="spin dark" />}{e.apply}</button>
          </div>
          <span id="promo-m" role="status" className="msg" style={{ color: pmsg[1] }}>{pmsg[0]}</span>
        </form>
      </section>
    );
  } else {
    const p = E.pay;
    stepHtml = (
      <section aria-labelledby="st-t" style={sx('display:flex;flex-direction:column;gap:16px')}>
        <header><h1 id="st-t" style={sx('font-size:clamp(26px,3.4vw,36px);font-weight:800')}>{e.payTitle}</h1><p className="lead" style={sx('display:flex;gap:8px;align-items:center')}><Icon name="lock" size={18} />{e.payLead}</p></header>
        {p.status === 'failed' && <div className="notice n-bad" role="alert" style={sx('flex-direction:column;align-items:flex-start;gap:4px')}><strong style={sx('font-size:17px')}>{e.payFailedTitle}</strong><span style={sx('font-weight:500')}>{p.error}</span></div>}
        <fieldset className="card grid" style={sx('--min:200px;padding:20px;gap:10px')}>
          <legend>{e.method}</legend>
          {(['knet', 'card', 'apple', 'google'] as const).map((m) => (
            <label key={m} className="tap" style={{ ...sx('display:flex;align-items:center;gap:10px;min-height:58px;padding:0 14px;border-radius:14px;font-weight:700;cursor:pointer'), border: `2px solid ${E.method === m ? 'var(--btn)' : 'var(--line)'}`, background: E.method === m ? 'var(--brand-tint)' : 'var(--card)' }}>
              <input type="radio" name="pay-method" value={m} checked={E.method === m} onChange={() => patch({ method: m })} style={sx('width:20px;height:20px;accent-color:var(--btn)')} />{e.methods[m]}
            </label>
          ))}
        </fieldset>
      </section>
    );
  }

  const nextLabel = { 2: e.nextDetails, 3: e.nextDiscount, 4: e.nextPay, 5: '' }[step];
  const mm = Math.floor(hold / 60), ss = String(hold % 60).padStart(2, '0');
  const ssText = lang === 'ar' ? ss.replace(/\d/g, (d) => AR_DIGITS[Number(d)]) : ss;

  return (
    <div className="wrap" style={sx('padding-block:24px 48px;display:flex;flex-direction:column;gap:20px')}>
      <StepProgress cur={step} />
      <div className={`notice ${expired ? 'n-bad' : hold < 120 ? 'n-coral' : 'n-info'}`} role="timer">
        <span style={sx('display:flex;align-items:center;gap:10px')}><Icon name="clock" /><span suppressHydrationWarning>{expired ? e.holdExpired : fill(e.hold, { time: `${num(mm)}:${ssText}` })}</span></span>
        {expired && <button type="button" className="btn btn-dark" style={sx('min-height:44px')} onClick={() => { startHold(); showToast(a.toastRenewed); }}>{e.renewHold}</button>}
      </div>
      <div style={sx('display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start')}>
        <div style={sx('flex:999 1 560px;min-width:0;display:flex;flex-direction:column;gap:20px')}>
          {stepHtml}
          <div style={sx('display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px')}>
            {step === 2
              ? <Link href="/programs" className="btn btn-ghost">{e.backToPrograms}</Link>
              : <button type="button" className="btn btn-ghost" onClick={stepBack} disabled={paying}>{t.common.back}</button>}
            {step === 5
              ? <button type="button" className="btn btn-coral btn-lg" style={sx('flex:1 1 260px')} onClick={pay} disabled={paying || expired} aria-busy={paying}>{paying ? <><span className="spin" />{e.paying}</> : fill(E.pay.status === 'failed' ? e.payRetry : e.pay, { amount: kwd(q.total) })}</button>
              : <button type="button" className="btn btn-primary btn-lg" style={sx('flex:1 1 220px')} onClick={stepNext} disabled={expired}>{nextLabel}</button>}
          </div>
        </div>
        <div style={{ ...sx('flex:1 1 320px;min-width:0;display:flex;flex-direction:column;gap:10px;position:sticky'), top: 'calc(80px + env(safe-area-inset-top,0px))' }}>
          <OrderSummary lines={lines} q={q} showDiscount={showDiscount} promoCode={E.promo.applied} />
          {!showDiscount && E.kids.length > 1 && <p className="msg" style={sx('font-size:14px;padding-inline:6px')}>{e.discountLater}</p>}
        </div>
      </div>
    </div>
  );
}
