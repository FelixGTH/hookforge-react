import { useState, useEffect, useRef } from 'react';

interface Size {
  width: number;
  height: number;
}

/**
 * Tracks an element's width and height as it resizes.
 * Useful for charts, dynamic layouts, text overflow detection.
 *
 * @example
 * const [ref, { width, height }] = useResizeObserver();
 * return <canvas ref={ref} width={width} height={height} />
 */
export function useResizeObserver(): [React.RefObject<HTMLElement>, Size] {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
