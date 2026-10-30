'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { AR, type Dict } from '@/lib/ar';
import { EN } from '@/lib/en';
import { APP, type AppStrings } from '@/lib/app-strings';
import { type AgeId, type ErrorKey, type Gender, type Kid, type Lang, type Parent, type ShiftId } from '@/lib/domain';

const DICT: Record<Lang, Dict> = { ar: AR, en: EN };

export type Toast = { msg: string; action?: { label: string; run: () => void } } | null;
export type SheetState = null | { type: 'demo' } | { type: 'badge'; badge: { name: string; desc: string; color: string; got: boolean } };
export type DemoFlags = { netFail: boolean; payFail: boolean; shortHold: boolean };
export type Filters = { age: 'all' | AgeId; shift: 'all' | ShiftId; gender: 'all' | Gender; sort: 'soon' | 'popular' | 'seats' };
export type PromoStatus = 'idle' | 'empty' | 'checking' | 'valid' | 'invalid' | 'error';

export interface EnrollState {
  step: 2 | 3 | 4 | 5 | 'done';
  kids: Kid[]; nextId: number; parent: Parent; terms: boolean; photo: boolean; errors: Record<string, ErrorKey>;
  promo: { code: string; status: PromoStatus; pct: number; applied: string };
  method: 'knet' | 'card' | 'apple' | 'google';
  pay: { status: 'idle' | 'processing' | 'failed'; attempts: number; error: string };
  /** Epoch ms when the seat hold ends; 0 until the client starts it (keeps SSR output stable). */
  holdEnd: number;
  ref: string;
}

export const newKid = (id: number): Kid => ({ id, name: '', dob: '', gender: 'boys', age: 'a1', shift: 'morning', round: 1, level: 'beginner', fear: false, notes: '' });
const freshEnroll = (): EnrollState => ({
  step: 2, kids: [newKid(1)], nextId: 2,
  parent: { name: '', phone: '', email: '', emergencyName: '', emergencyPhone: '' },
  terms: false, photo: false, errors: {},
  promo: { code: '', status: 'idle', pct: 0, applied: '' },
  method: 'knet', pay: { status: 'idle', attempts: 0, error: '' }, holdEnd: 0, ref: ''
});

const DEFAULT_FILTERS: Filters = { age: 'all', shift: 'all', gender: 'all', sort: 'soon' };
type LoaderKey = 'programs' | 'account' | 'admin';

interface Ctx {
  lang: Lang; t: Dict; a: AppStrings; num: (n: number) => string; kwd: (n: number) => string;
  ageName: (id: AgeId) => string; ageRange: (id: AgeId) => string; L: <T>(o: T | { ar: T; en: T }) => T;
  toggleLang: () => void;
  alertOpen: boolean; closeAlert: () => void;
  toast: Toast; showToast: (msg: string, action?: { label: string; run: () => void }) => void; clearToast: () => void;
  sheet: SheetState; setSheet: (s: SheetState) => void;
  demo: DemoFlags; setDemoFlag: (k: keyof DemoFlags, v: boolean) => void;
  filters: Filters; setFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void; clearFilters: () => void;
  waitlist: Record<string, boolean>; toggleWaitlist: (id: string) => void;
  enroll: EnrollState; setEnroll: Dispatch<SetStateAction<EnrollState>>; resetEnroll: () => void; startHold: () => void; holdSeconds: () => number;
  codes: Record<string, boolean>; setCode: (code: string, on: boolean) => void;
  loaded: React.MutableRefObject<Record<LoaderKey, boolean>>; failedOnce: React.MutableRefObject<Record<LoaderKey, boolean>>;
  canGoBack: boolean;
}

const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used inside <AppProvider>');
  return c;
};

const buzzNow = () => { try { navigator.vibrate?.(10); } catch { /* unsupported */ } };
export const buzz = buzzNow;

export function AppProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [alertOpen, setAlertOpen] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [demo, setDemo] = useState<DemoFlags>({ netFail: false, payFail: true, shortHold: false });
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [waitlist, setWaitlist] = useState<Record<string, boolean>>({});
  const [enroll, setEnroll] = useState<EnrollState>(freshEnroll);
  const [codes, setCodes] = useState<Record<string, boolean>>({ SIBLING: true, WELCOME: true, SUMMER: false, STAFF: true });
  const loaded = useRef<Record<LoaderKey, boolean>>({ programs: false, account: false, admin: false });
  const failedOnce = useRef<Record<LoaderKey, boolean>>({ programs: false, account: false, admin: false });
  const [navCount, setNavCount] = useState(0);
  const pathname = usePathname();

  const holdSeconds = useCallback(() => (demo.shortHold ? 30 : 600), [demo.shortHold]);
  const startHold = useCallback(() => setEnroll((e) => ({ ...e, holdEnd: Date.now() + holdSeconds() * 1000 })), [holdSeconds]);
  const resetEnroll = useCallback(() => setEnroll({ ...freshEnroll(), holdEnd: Date.now() + holdSeconds() * 1000 }), [holdSeconds]);

  // Client-only boot: saved filters, and the seat hold starts once we are in the browser.
  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem('mawj.filters') || 'null');
      if (f) setFilters((cur) => ({ ...cur, ...f }));
    } catch { /* ignore corrupt storage */ }
    setEnroll((e) => (e.holdEnd ? e : { ...e, holdEnd: Date.now() + 600 * 1000 }));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar' ? 'نادي موج للسباحة' : 'MAWJ Swim Club';
  }, [lang]);

  // Count in-app navigations so the edge-swipe only goes back inside the app.
  useEffect(() => { setNavCount((n) => n + 1); setSheet(null); }, [pathname]);

  const clearToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((msg: string, action?: { label: string; run: () => void }) => {
    setToast({ msg, action });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), action ? 5000 : 2800);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((l) => {
      const next: Lang = l === 'ar' ? 'en' : 'ar';
      try { localStorage.setItem('mawj.lang', next); } catch { /* ignore */ }
      document.cookie = `mawj.lang=${next};path=/;max-age=31536000;samesite=lax`;
      return next;
    });
  }, []);

  const setDemoFlag = useCallback((k: keyof DemoFlags, v: boolean) => {
    setDemo((d) => ({ ...d, [k]: v }));
    if (k === 'netFail') { failedOnce.current.programs = false; failedOnce.current.account = false; }
    if (k === 'shortHold') setEnroll((e) => (e.step === 'done' ? e : { ...e, holdEnd: Date.now() + (v ? 30 : 600) * 1000 }));
  }, []);

  const setFilter = useCallback<Ctx['setFilter']>((k, v) => {
    setFilters((f) => {
      const next = { ...f, [k]: v };
      try { localStorage.setItem('mawj.filters', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);
  const clearFilters = useCallback(() => {
    setFilters((f) => {
      const next = { ...f, age: 'all' as const, shift: 'all' as const, gender: 'all' as const };
      try { localStorage.setItem('mawj.filters', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleWaitlist = useCallback((id: string) => setWaitlist((w) => ({ ...w, [id]: !w[id] })), []);

  const setCode = useCallback((code: string, on: boolean) => setCodes((c) => ({ ...c, [code]: on })), []);

  const value = useMemo<Ctx>(() => {
    const t = DICT[lang];
    const loc = lang === 'ar' ? 'ar-KW' : 'en-KW';
    const nf = new Intl.NumberFormat(loc);
    const kf = new Intl.NumberFormat(loc, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    return {
      lang, t, a: APP[lang], num: (n) => nf.format(n), kwd: (n) => kf.format(n) + (lang === 'ar' ? ' د.ك' : ' KWD'),
      ageName: (id) => t.ages.groups[id].name, ageRange: (id) => t.ages.groups[id].range,
      L: <T,>(o: T | { ar: T; en: T }) => (o && typeof o === 'object' && 'ar' in (o as object) ? (o as { ar: T; en: T })[lang] : (o as T)),
      toggleLang, alertOpen, closeAlert: () => setAlertOpen(false),
      toast, showToast, clearToast, sheet, setSheet, demo, setDemoFlag,
      filters, setFilter, clearFilters, waitlist, toggleWaitlist,
      enroll, setEnroll, resetEnroll, startHold, holdSeconds, codes, setCode, loaded, failedOnce, canGoBack: navCount > 1
    };
  }, [lang, toggleLang, alertOpen, toast, showToast, clearToast, sheet, demo, setDemoFlag, filters, setFilter, clearFilters, waitlist, toggleWaitlist, enroll, resetEnroll, startHold, holdSeconds, codes, setCode, navCount]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
