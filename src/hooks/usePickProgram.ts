'use client';

import { useRouter } from 'next/navigation';
import { useApp, newKid } from '@/context/AppContext';
import { fill, type Program } from '@/lib/domain';

/** Preloads the first child of the order from a program card, then opens the enrollment flow. */
export function usePickProgram() {
  const router = useRouter();
  const { setEnroll, resetEnroll, enroll, showToast, a, ageName } = useApp();
  return (p: Program) => {
    const patch = { age: p.age, shift: p.shift, gender: p.gender, round: p.round };
    if (enroll.step === 'done') {
      resetEnroll();
      setEnroll((e) => ({ ...e, kids: [{ ...newKid(1), ...patch }] }));
    } else {
      setEnroll((e) => ({ ...e, step: 2, kids: e.kids.map((k, i) => (i === 0 ? { ...k, ...patch } : k)) }));
    }
    showToast(fill(a.toastPicked, { name: ageName(p.age) }));
    router.push('/enroll');
  };
}
