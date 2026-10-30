'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { fakeApi } from '@/lib/domain';

type Key = 'programs' | 'account' | 'admin';

/** Simulated data load: loading → success | error. Stays "success" after the first load. */
export function useLoader(key: Key, ms: number) {
  const { demo, loaded, failedOnce } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const run = useCallback((silent = false) => {
    if (!silent) setStatus('loading');
    const fail = key !== 'admin' && demo.netFail && !failedOnce.current[key];
    return fakeApi(true, ms, fail)
      .then(() => { loaded.current[key] = true; setStatus('success'); })
      .catch(() => { failedOnce.current[key] = true; setStatus('error'); });
  }, [key, ms, demo.netFail, loaded, failedOnce]);

  useEffect(() => {
    if (loaded.current[key]) setStatus('success');
    else run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, reload: () => run(), refresh: () => run(true) };
}
