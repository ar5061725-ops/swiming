export type Lang = 'ar' | 'en';
export type AgeId = 'a1' | 'a2' | 'a3' | 'a4' | 'a5';
export type ShiftId = 'morning' | 'evening' | 'night';
export type Gender = 'boys' | 'girls';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Program {
  id: string; age: AgeId; shift: ShiftId; gender: Gender; round: number; seats: number; cap: number; demand: number; badge?: 'new' | 'popular';
}
export interface Kid {
  id: number; name: string; dob: string; gender: Gender; age: AgeId; shift: ShiftId; round: number; level: Level; fear: boolean; notes: string;
}
export interface Parent { name: string; phone: string; email: string; emergencyName: string; emergencyPhone: string }

export const AGE_GROUPS: Record<AgeId, { min: number; color: string; ratio: number }> = {
  a1: { min: 6, color: '#0B7A85', ratio: 4 }, a2: { min: 8, color: '#1D5FA8', ratio: 5 }, a3: { min: 10, color: '#5B3FA8', ratio: 6 },
  a4: { min: 12, color: '#A6461E', ratio: 8 }, a5: { min: 14, color: '#0B2A3C', ratio: 8 }
};
export const AGE_IDS = Object.keys(AGE_GROUPS) as AgeId[];
export const SHIFTS: ShiftId[] = ['morning', 'evening', 'night'];
export const SHIFT_ICON = { morning: 'sun', evening: 'sunset', night: 'moon' } as const;

export const PROGRAMS: Program[] = [
  { id: 'p1', age: 'a1', shift: 'morning', gender: 'boys', round: 1, seats: 3, cap: 16, demand: 9, badge: 'new' },
  { id: 'p2', age: 'a1', shift: 'evening', gender: 'girls', round: 1, seats: 9, cap: 16, demand: 7 },
  { id: 'p3', age: 'a2', shift: 'evening', gender: 'girls', round: 1, seats: 11, cap: 20, demand: 10, badge: 'popular' },
  { id: 'p4', age: 'a2', shift: 'morning', gender: 'boys', round: 2, seats: 14, cap: 20, demand: 6 },
  { id: 'p5', age: 'a3', shift: 'morning', gender: 'girls', round: 2, seats: 0, cap: 20, demand: 8 },
  { id: 'p6', age: 'a3', shift: 'evening', gender: 'boys', round: 2, seats: 6, cap: 20, demand: 5 },
  { id: 'p7', age: 'a4', shift: 'night', gender: 'boys', round: 3, seats: 18, cap: 24, demand: 4 },
  { id: 'p8', age: 'a5', shift: 'night', gender: 'girls', round: 3, seats: 4, cap: 24, demand: 7 },
  { id: 'p9', age: 'a5', shift: 'night', gender: 'boys', round: 1, seats: 0, cap: 24, demand: 9 }
];
export const SEAT_MAP: Record<AgeId, Record<ShiftId, number | null>> = {
  a1: { morning: 3, evening: 9, night: null }, a2: { morning: 14, evening: 11, night: null }, a3: { morning: 0, evening: 6, night: null },
  a4: { morning: null, evening: 8, night: 18 }, a5: { morning: null, evening: null, night: 4 }
};
export const PRICE = 120;

export const firstOpenShift = (age: AgeId, pref: ShiftId): ShiftId =>
  (SEAT_MAP[age][pref] || 0) > 0 ? pref : SHIFTS.find((s) => (SEAT_MAP[age][s] || 0) > 0) || pref;
export const siblingPct = (n: number) => (n >= 3 ? 15 : n === 2 ? 10 : 0);

export function quote(n: number, promoPct = 0) {
  const sib = siblingPct(n);
  const pct = Math.max(sib, promoPct);
  const subF = n * PRICE * 1000;
  const discF = Math.round((subF * pct) / 100);
  return { subtotal: subF / 1000, sib, promoPct, pct, source: (pct === 0 ? null : promoPct > sib ? 'promo' : 'sibling') as 'promo' | 'sibling' | null, discount: discF / 1000, total: (subF - discF) / 1000 };
}
export type Quote = ReturnType<typeof quote>;

export function ageOn(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let y = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) y--;
  return y;
}
export const groupFor = (y: number | null): AgeId | 'out' | null =>
  y === null ? null : y < 6 || y > 18 ? 'out' : y < 8 ? 'a1' : y < 10 ? 'a2' : y < 12 ? 'a3' : y < 14 ? 'a4' : 'a5';

export const digitsOnly = (v: string) => String(v || '').replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\D/g, '');
export const isKwMobile = (v: string) => /^[569]\d{7}$/.test(digitsOnly(v));
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export type ErrorKey = 'nameRequired' | 'phoneInvalid' | 'emailInvalid' | 'emergencyRequired' | 'childNameRequired' | 'dobRequired' | 'ageOutOfRange' | 'ageGroupMismatch' | 'termsRequired';

export function validateEnrollment(p: Parent, kids: Kid[], terms: boolean) {
  const e: Record<string, ErrorKey> = {};
  if (p.name.trim().length < 3) e['parent.name'] = 'nameRequired';
  if (!isKwMobile(p.phone)) e['parent.phone'] = 'phoneInvalid';
  if (!isEmail(p.email)) e['parent.email'] = 'emailInvalid';
  if (p.emergencyName.trim().length < 2) e['parent.emergencyName'] = 'emergencyRequired';
  if (!isKwMobile(p.emergencyPhone)) e['parent.emergencyPhone'] = 'phoneInvalid';
  kids.forEach((k) => {
    if (k.name.trim().length < 2) e[`kid.${k.id}.name`] = 'childNameRequired';
    const g = groupFor(ageOn(k.dob));
    if (!k.dob) e[`kid.${k.id}.dob`] = 'dobRequired';
    else if (g === 'out') e[`kid.${k.id}.dob`] = 'ageOutOfRange';
    else if (g !== k.age) e[`kid.${k.id}.dob`] = 'ageGroupMismatch';
  });
  if (!terms) e.terms = 'termsRequired';
  return e;
}

/** Simulated network call. Replace with fetch('/api/...') in production. */
export const fakeApi = <T,>(result: T | (() => T), ms = 700, fail = false) =>
  new Promise<T>((res, rej) => setTimeout(() => (fail ? rej(new Error('network')) : res(typeof result === 'function' ? (result as () => T)() : result)), ms));

export const fill = (t: string, v: Record<string, string | number> = {}) => String(t).replace(/\{(\w+)\}/g, (_, k: string) => (k in v ? String(v[k]) : `{${k}}`));
