import { useState, useEffect, useCallback, useRef } from 'react';

type FetchState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

/**
 * Data fetching with abort on unmount and URL change.
 * Pass `null` to skip conditionally.
 *
 * @example
 * const { status, data, error, refetch } = useFetch<User[]>('/api/users');
 */
export function useFetch<T>(url: string | null, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    if (!url) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ status: 'loading', data: null, error: null });

    try {
      const res = await fetch(url, { ...options, signal: abortRef.current.signal });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = (await res.json()) as T;
      setState({ status: 'success', data, error: null });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const error = err instanceof Error ? err : new Error(String(err));
      setState({ status: 'error', data: null, error });
    }
  }, [url, options]);

  useEffect(() => {
    void run();
    return () => abortRef.current?.abort();
  }, [run]);

  return { ...state, refetch: run };
}
