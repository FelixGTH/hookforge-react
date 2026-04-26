import { useState, useEffect, useRef } from 'react';

/**
 * Tells you when an element enters or leaves the viewport.
 * Good for lazy loading, scroll animations, infinite lists.
 *
 * @example
 * const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
 * const visible = entry?.isIntersecting ?? false;
 * return <div ref={ref}>{visible ? 'on screen' : 'off screen'}</div>
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit,
): [React.RefObject<HTMLElement>, IntersectionObserverEntry | null] {
  const ref = useRef<HTMLElement>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([e]) => setEntry(e ?? null), options);
    observer.observe(el);

    return () => observer.disconnect();
  }, [options]);

  return [ref, entry];
}
