import { renderHook, act } from '@testing-library/react';
import { useUndo } from './useUndo';

describe('useUndo', () => {
  it('starts with the initial value', () => {
    const { result } = renderHook(() => useUndo('hello'));
    expect(result.current.value).toBe('hello');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('updates the value and enables undo', () => {
    const { result } = renderHook(() => useUndo('hello'));

    act(() => result.current.set('world'));

    expect(result.current.value).toBe('world');
    expect(result.current.canUndo).toBe(true);
  });

  it('undo goes back to the previous value', () => {
    const { result } = renderHook(() => useUndo('hello'));

    act(() => result.current.set('world'));
    act(() => result.current.undo());

    expect(result.current.value).toBe('hello');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it('redo goes forward after undo', () => {
    const { result } = renderHook(() => useUndo('hello'));

    act(() => result.current.set('world'));
    act(() => result.current.undo());
    act(() => result.current.redo());

    expect(result.current.value).toBe('world');
    expect(result.current.canRedo).toBe(false);
  });

  it('clears redo history when setting a new value after undo', () => {
    const { result } = renderHook(() => useUndo('a'));

    act(() => result.current.set('b'));
    act(() => result.current.set('c'));
    act(() => result.current.undo());

    expect(result.current.canRedo).toBe(true);

    act(() => result.current.set('d'));

    expect(result.current.canRedo).toBe(false);
    expect(result.current.value).toBe('d');
  });

  it('tracks full history', () => {
    const { result } = renderHook(() => useUndo('a'));

    act(() => result.current.set('b'));
    act(() => result.current.set('c'));

    expect(result.current.history).toEqual(['a', 'b', 'c']);
  });
});
