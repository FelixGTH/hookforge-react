import { useRef, useEffect } from 'react';

/**
 * Returns whatever the value was on the previous render.
 * First render is always `undefined`.
 *
 * @example
 * const prevCount = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
