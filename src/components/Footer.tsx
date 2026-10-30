'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { useApp } from '@/context/AppContext';
import { fakeApi, isEmail } from '@/lib/domain';
import { sx } from '@/lib/sx';

type FooterLink = { label: string; href?: string; act?: 'login' | 'help' | 'policy' };

export function Footer() {
  const { t, a, showToast, setSheet } = useApp();
  const f = t.footer;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'invalid' | 'loading' | 'done'>('idle');
  const msg = { idle: ['', ''], invalid: [f.newsletterInvalid, '#FFB4A8'], loading: [f.newsletterLoading, ''], done: [f.newsletterDone, '#8FE3B0'] }[status];

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) { setStatus('invalid'); return; }
    setStatus('loading');
    fakeApi(true, 700).then(() => { setStatus('done'); setEmail(''); showToast(a.toastSubscribed); });
  }
  const onAct = (act: NonNullable<FooterLink['act']>) => showToast({ login: a.toastLogin, help: a.toastHelp, policy: a.toastPolicy }[act]);

  const col = (title: string, links: FooterLink[]) => (
    <nav aria-label={title} style={sx('display:flex;flex-direction:column;gap:2px')}>
      <strong style={sx('font-size:16px;margin-bottom:4px')}>{title}</strong>
      {links.map((l) => l.href
        ? <Link key={l.label} href={l.href} style={sx('min-height:40px;display:inline-flex;align-items:center')}>{l.label}</Link>
        : <button key={l.label} type="button" className="btn-link" style={sx('text-align:start;padding:0;min-height:40px')} onClick={() => onAct(l.act!)}>{l.label}</button>)}
    </nav>
  );

  return (
    <footer className="ftr">
      <div className="wrap" style={sx('padding-block:48px 24px;display:flex;flex-direction:column;gap:32px')}>
        <div className="grid" style={sx('--min:200px;gap:28px')}>
          <div style={sx('display:flex;flex-direction:column;gap:12px')}>
            <strong style={sx('font-size:26px;font-weight:800')}>{t.brand.name}</strong>
            <p style={sx('font-size:15px')}>{f.about}</p>
            <form onSubmit={submit} noValidate style={sx('display:flex;flex-direction:column;gap:8px')}>
              <label htmlFor="news-email" style={sx('font-weight:700;font-size:14px;color:#fff')}>{f.newsletter}</label>
              <div style={sx('display:flex;gap:8px')}>
                <input id="news-email" type="email" inputMode="email" autoComplete="email" dir="ltr" placeholder={f.emailPlaceholder} value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'invalid') setStatus('idle'); }} aria-invalid={status === 'invalid'} aria-describedby="news-m" />
                <button type="submit" className="btn btn-primary" style={sx('min-height:44px')} disabled={status === 'loading'}>{status === 'loading' ? <span className="spin" /> : f.subscribe}</button>
              </div>
              <span id="news-m" role="status" style={{ ...sx('font-size:13px;min-height:20px'), color: msg[1] || 'inherit' }}>{msg[0]}</span>
            </form>
          </div>
          {col(f.club, [{ label: t.nav.programs, href: '/programs' }, { label: t.nav.pricing, href: '/programs' }, { label: t.nav.safety, href: '/#safety' }, { label: t.nav.admin, href: '/admin' }])}
          {col(f.account, [{ label: f.login, act: 'login' }, { label: t.nav.enroll, href: '/enroll' }, { label: t.nav.account, href: '/account' }, { label: f.help, act: 'help' }])}
          {col(f.policies, [{ label: f.terms, act: 'policy' }, { label: f.privacy, act: 'policy' }, { label: f.refunds, act: 'policy' }, { label: f.childProtection, act: 'policy' }])}
        </div>
        <div style={sx('border-top:1px solid #23465C;padding-top:16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;font-size:14px')}>
          <span>{f.rights}</span><span>{f.contactLine}</span>
          <button type="button" className="btn btn-ghost" onClick={() => setSheet({ type: 'demo' })} style={sx('min-height:40px;background:transparent;color:inherit;border-color:#3E5666')}><Icon name="sliders" size={18} />{a.demoTools}</button>
        </div>
      </div>
    </footer>
  );
}
