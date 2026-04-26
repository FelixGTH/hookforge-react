import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('accepts an initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('toggle flips the value', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);

    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });

  it('set forces a specific value', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => result.current[2](true));
    expect(result.current[0]).toBe(true);
  });

  it('toggle and set stay the same reference across renders', () => {
    const { result, rerender } = renderHook(() => useToggle(false));
    const [, toggle, set] = result.current;

    rerender();

    expect(result.current[1]).toBe(toggle);
    expect(result.current[2]).toBe(set);
  });
});
