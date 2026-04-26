import { useRef } from 'react';
import { useEventListener } from '../useEventListener/useEventListener';

/**
 * Calls handler when the user clicks outside the returned ref.
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 */
export function useClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent) => void,
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEventListener(document, 'mousedown', (event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      handler(event);
    }
  });

  return ref;
}
