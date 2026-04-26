import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useEventListener } from './useEventListener';

describe('useEventListener', () => {
  it('calls the handler when the event fires on window', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener(window, 'click', handler));

    window.dispatchEvent(new MouseEvent('click'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('calls the handler when the event fires on a ref element', () => {
    const handler = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);

    renderHook(() => {
      const ref = useRef(div);
      useEventListener(ref, 'click', handler);
    });

    div.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(div);
  });

  it('removes the listener when the component unmounts', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener(window, 'click', handler));

    unmount();
    window.dispatchEvent(new MouseEvent('click'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('always calls the latest version of the handler', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(({ h }) => useEventListener(window, 'click', h), {
      initialProps: { h: first },
    });

    rerender({ h: second });
    window.dispatchEvent(new MouseEvent('click'));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
