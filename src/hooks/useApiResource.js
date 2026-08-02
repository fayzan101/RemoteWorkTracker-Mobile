import { useCallback, useEffect, useRef, useState } from 'react';

export function useApiResource(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await loaderRef.current();
      setData(next ?? null);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'string'
            ? e
            : null;
      setError((msg && String(msg).trim()) || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // Caller supplies `deps` the same way as useEffect(fn, deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, ...deps]);

  return { data, loading, error, reload, setData };
}
