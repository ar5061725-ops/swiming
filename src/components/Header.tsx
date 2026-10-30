'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';
import { useApp } from '@/context/AppContext';
import { sx } from '@/lib/sx';

export function Header() {
  const { t, a, lang, toggleLang, showToast } = useApp();
  const pathname = usePathname();
  const nav = [['/', t.nav.home], ['/programs', t.nav.programs], ['/account', t.nav.account], ['/admin', t.nav.admin]] as const;

  async function share() {
    const url = location.origin + pathname;
    try {
      if (navigator.share) { await navigator.share({ title: t.brand.name, text: a.shareText, url }); return; }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
    }
    try { await navigator.clipboard.writeText(url); showToast(a.linkCopied); } catch { showToast(a.shareFallback); }
  }

  return (
    <header className="hdr">
      <div className="wrap hdr-row">
        <Link href="/" className="logo tap" aria-label={`${t.brand.name} — ${t.nav.home}`}>
          <span className="logo-mark"><Icon name="wave" size={24} stroke={2.2} /></span>
          <span><b>{t.brand.name}</b><small>{t.brand.latin}</small></span>
        </Link>
        <nav className="hdr-nav" aria-label={t.nav.mainMenu}>
          {nav.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <div className="hdr-actions">
          <button type="button" className="icon-btn" onClick={share} aria-label={a.share}><Icon name="share" /></button>
          <button type="button" className="icon-btn" onClick={toggleLang} lang={lang === 'ar' ? 'en' : 'ar'} aria-label={t.nav.switchLangLabel}>{t.nav.switchLang}</button>
          <Link href="/enroll" className="btn btn-coral cta-sm" style={sx('min-height:44px;padding:0 18px')}>{t.nav.enroll}</Link>
        </div>
      </div>
    </header>
  );
}
