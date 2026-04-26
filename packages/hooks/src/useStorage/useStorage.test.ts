import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import { useSessionStorage } from '../useSessionStorage/useSessionStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('reads an existing value from storage', () => {
    localStorage.setItem('key', JSON.stringify('saved'));
    const { result } = renderHook(() => useLocalStorage('key', 'hello'));
    expect(result.current[0]).toBe('saved');
  });

  it('saves the value to storage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'hello'));

    act(() => result.current[1]('world'));

    expect(result.current[0]).toBe('world');
    expect(localStorage.getItem('key')).toBe(JSON.stringify('world'));
  });

  it('removes the value and resets to initial', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'hello'));

    act(() => result.current[1]('world'));
    act(() => result.current[2]());

    expect(result.current[0]).toBe('hello');
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('works with objects', () => {
    const { result } = renderHook(() => useLocalStorage('user', { name: 'Alice', age: 30 }));

    act(() => result.current[1]({ name: 'Bob', age: 25 }));

    expect(result.current[0]).toEqual({ name: 'Bob', age: 25 });
  });

  it('falls back to initial value when storage contains invalid JSON', () => {
    localStorage.setItem('key', 'not-valid-json{{{');
    const { result } = renderHook(() => useLocalStorage('key', 42));
    expect(result.current[0]).toBe(42);
  });
});

describe('useSessionStorage', () => {
  beforeEach(() => sessionStorage.clear());

  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('reads an existing value from storage', () => {
    sessionStorage.setItem('key', JSON.stringify('saved'));
    const { result } = renderHook(() => useSessionStorage('key', 'hello'));
    expect(result.current[0]).toBe('saved');
  });

  it('saves the value to storage', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'hello'));

    act(() => result.current[1]('world'));

    expect(result.current[0]).toBe('world');
    expect(sessionStorage.getItem('key')).toBe(JSON.stringify('world'));
  });

  it('removes the value and resets to initial', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'hello'));

    act(() => result.current[1]('world'));
    act(() => result.current[2]());

    expect(result.current[0]).toBe('hello');
    expect(sessionStorage.getItem('key')).toBeNull();
  });

  it('works with objects', () => {
    const { result } = renderHook(() => useSessionStorage('user', { name: 'Alice', age: 30 }));

    act(() => result.current[1]({ name: 'Bob', age: 25 }));

    expect(result.current[0]).toEqual({ name: 'Bob', age: 25 });
  });

  it('falls back to initial value when storage contains invalid JSON', () => {
    sessionStorage.setItem('key', 'not-valid-json{{{');
    const { result } = renderHook(() => useSessionStorage('key', 42));
    expect(result.current[0]).toBe(42);
  });
});
