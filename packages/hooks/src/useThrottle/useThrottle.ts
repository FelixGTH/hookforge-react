import { useState, useEffect, useRef } from 'react';

/**
 * Throttles a value to at most once per interval.
 * Scroll handlers will thank you.
 *
 * @example
 * const throttledY = useThrottle(scrollY, 200);
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastRan = useRef<number>(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const now = Date.now();
    const remaining = interval - (now - lastRan.current);

    if (remaining <= 0) {
      lastRan.current = now;
      setThrottled(value);
    } else {
      const timer = setTimeout(() => {
        lastRan.current = Date.now();
        setThrottled(value);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttled;
}
