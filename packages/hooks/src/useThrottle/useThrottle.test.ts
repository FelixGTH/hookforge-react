import { renderHook, act } from '@testing-library/react';
import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value right away', () => {
    const { result } = renderHook(() => useThrottle('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('updates immediately on the first change', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 0 },
    });

    rerender({ value: 1 });
    expect(result.current).toBe(1);
  });

  it('blocks updates during the interval', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 0 },
    });

    rerender({ value: 1 });
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(100));

    expect(result.current).toBe(1);
  });

  it('lets the latest value through after the interval', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 0 },
    });

    rerender({ value: 1 });
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe(2);
  });
});
