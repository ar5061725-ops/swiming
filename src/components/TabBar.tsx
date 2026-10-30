'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './Icon';
import { useApp } from '@/context/AppContext';

const TABS: [string, 'home' | 'programs' | 'enroll' | 'account', IconName][] = [
  ['/', 'home', 'home'], ['/programs', 'programs', 'grid'], ['/enroll', 'enroll', 'plus'], ['/account', 'account', 'user']
];

export function TabBar() {
  const { t, a } = useApp();
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label={t.nav.mainMenu}>
      {TABS.map(([href, key, ic]) => (
        <Link key={href} href={href} className={`tap ${key === 'enroll' && pathname !== '/enroll' ? 'tab-cta' : ''}`} aria-current={pathname === href ? 'page' : undefined}>
          <Icon name={ic} size={22} /><span>{a.tabs[key]}</span>
        </Link>
      ))}
    </nav>
  );
}
