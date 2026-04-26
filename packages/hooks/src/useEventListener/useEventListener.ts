import { useEffect, useRef } from 'react';

type Target = EventTarget | null;

/**
 * Attach an event listener to anything — window, document, or a ref.
 * Cleans up on unmount, always uses the latest handler.
 *
 * @example
 * useEventListener(window, 'resize', () => console.log(window.innerWidth));
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: React.RefObject<Element | null> | Target,
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const el = target && 'current' in target ? target.current : target;
    if (!el) return;

    const listener = (e: Event) => savedHandler.current(e as WindowEventMap[K]);

    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  }, [target, event, options]);
}
