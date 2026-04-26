import { useState, useCallback } from 'react';

interface UseUndoReturn<T> {
  value: T;
  set: (next: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
}

/**
 * useState with undo/redo.
 * Every `set` call saves the current value to history.
 *
 * @param limit - max history size, default 100
 *
 * @example
 * const { value, set, undo, redo, canUndo } = useUndo('hello');
 * set('world');  // → 'world'
 * undo();        // → 'hello'
 * redo();        // → 'world'
 */
export function useUndo<T>(initialValue: T, limit = 100): UseUndoReturn<T> {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialValue);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((next: T) => {
    setPast(prev => [...prev.slice(-(limit - 1)), present]);
    setPresent(next);
    setFuture([]);
  }, [present, limit]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const prev = past[past.length - 1]!;
    setPast(p => p.slice(0, -1));
    setFuture(f => [present, ...f]);
    setPresent(prev);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0]!;
    setFuture(f => f.slice(1));
    setPast(p => [...p, present]);
    setPresent(next);
  }, [future, present]);

  return {
    value: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    history: [...past, present],
  };
}
