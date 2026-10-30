'use client';

import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { useApp } from '@/context/AppContext';
import { sx } from '@/lib/sx';

export default function NotFound() {
  const { t } = useApp();
  return (
    <div className="wrap" style={sx('padding-block:80px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px')}>
      <span style={sx('color:var(--link)')}><Icon name="wave" size={64} stroke={1.6} /></span>
      <h1 className="h2">{t.notFound.title}</h1>
      <p className="lead">{t.notFound.text}</p>
      <Link href="/" className="btn btn-primary">{t.notFound.home}</Link>
    </div>
  );
}
