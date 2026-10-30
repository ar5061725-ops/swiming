import type { AgeId, ShiftId } from './domain';

export type L10n = { ar: string; en: string };

export const ACCOUNT_DATA = {
  kids: [
    { id: 1, name: { ar: 'سارة', en: 'Sara' }, age: 'a1' as AgeId, shift: 'morning' as ShiftId, next: { ar: 'غدًا · [الوقت]', en: 'Tomorrow · [time]' }, coach: { ar: '[اسم المدربة]', en: '[coach name]' }, att: [9, 10], days: 4, level: { ar: 'مبتدئ', en: 'Beginner' }, skills: [4, 7], note: { ar: 'تطفو بثقة الآن، نعمل على التنفس الجانبي.', en: 'Floats confidently now; working on side breathing.' }, ok: true },
    { id: 2, name: { ar: 'يوسف', en: 'Yousef' }, age: 'a2' as AgeId, shift: 'evening' as ShiftId, next: { ar: 'الأحد · [الوقت]', en: 'Sunday · [time]' }, coach: { ar: '[اسم المدرب]', en: '[coach name]' }, att: [7, 8], days: 2, level: { ar: 'متوسط', en: 'Intermediate' }, skills: [6, 8], note: { ar: 'تحسّن واضح في سباحة الظهر.', en: 'Clear progress in backstroke.' }, ok: false }
  ],
  badges: [
    { id: 'b1', name: { ar: 'الطفو', en: 'Floater' }, desc: { ar: 'طفا وحده ١٠ ثوانٍ بثقة.', en: 'Floated alone for 10 seconds.' }, color: '#0B7A85', got: true },
    { id: 'b2', name: { ar: 'بلا غياب', en: 'Perfect week' }, desc: { ar: 'حضر كل حصص الأسبوع.', en: 'Attended every class this week.' }, color: '#C2492F', got: true },
    { id: 'b3', name: { ar: 'أول ١٠ م', en: 'First 10 m' }, desc: { ar: 'سبح ١٠ أمتار دون توقف.', en: 'Swam 10 metres non-stop.' }, color: '#1D5FA8', got: false },
    { id: 'b4', name: { ar: 'المنقذ', en: 'Lifesaver' }, desc: { ar: 'أتقن مهارات الأمان الأساسية.', en: 'Mastered core water-safety skills.' }, color: '#5B3FA8', got: false }
  ],
  payments: [
    { ref: 'MJ-482190', desc: { ar: 'سارة ويوسف · خصم الإخوة ١٠٪', en: 'Sara & Yousef · 10% sibling discount' }, amount: 216, ok: true },
    { ref: 'MJ-377415', desc: { ar: 'سارة · دورة سابقة', en: 'Sara · previous course' }, amount: 120, ok: true },
    { ref: 'MJ-361002', desc: { ar: 'محاولة دفع لم تكتمل', en: 'Incomplete payment attempt' }, amount: 120, ok: false }
  ],
  notifs: [
    { id: 'n1', title: { ar: 'وصلت سارة إلى النادي', en: 'Sara arrived at the club' }, body: { ar: 'سُجّل الحضور عبر رمز QR.', en: 'Checked in with her QR code.' }, when: { ar: 'قبل ساعة', en: '1 hour ago' }, unread: true },
    { id: 'n2', title: { ar: 'اشتراك يوسف ينتهي قريبًا', en: 'Yousef’s subscription ends soon' }, body: { ar: 'جدّد الآن واحتفظ بنفس الفترة والمدرب.', en: 'Renew now to keep the same shift and coach.' }, when: { ar: 'اليوم', en: 'Today' }, unread: true },
    { id: 'n3', title: { ar: 'تقرير أسبوعي جديد', en: 'New weekly report' }, body: { ar: 'ملاحظات المدرب على تقدّم سارة متاحة.', en: 'The coach’s notes on Sara’s progress are ready.' }, when: { ar: 'أمس', en: 'Yesterday' }, unread: false },
    { id: 'n4', title: { ar: 'شارة جديدة', en: 'New badge' }, body: { ar: 'حصل يوسف على شارة «بلا غياب».', en: 'Yousef earned the “Perfect week” badge.' }, when: { ar: 'قبل ٣ أيام', en: '3 days ago' }, unread: false }
  ]
};

export type AdminRowStatus = 'paid' | 'pending' | 'failed';
export const ADMIN_ROWS: [string, L10n, number, AgeId, ShiftId, number, AdminRowStatus][] = [
  ['MJ-482190', { ar: 'أم سارة', en: 'Sara’s mother' }, 2, 'a1', 'morning', 216, 'paid'],
  ['MJ-482188', { ar: 'أبو فهد', en: 'Fahad’s father' }, 1, 'a4', 'night', 120, 'pending'],
  ['MJ-482175', { ar: 'أم نورة', en: 'Noura’s mother' }, 3, 'a2', 'evening', 306, 'paid'],
  ['MJ-482160', { ar: 'أبو خالد', en: 'Khaled’s father' }, 1, 'a5', 'night', 120, 'failed'],
  ['MJ-482151', { ar: 'أم ريم', en: 'Reem’s mother' }, 2, 'a3', 'evening', 216, 'paid'],
  ['MJ-482140', { ar: 'أبو عمر', en: 'Omar’s father' }, 1, 'a1', 'evening', 120, 'paid']
];
