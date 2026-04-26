import { useState, useCallback } from 'react';

function read<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function createStorageHook(storage: Storage) {
  return function useStorage<T>(
    key: string,
    initialValue: T,
  ): [T, (value: T) => void, () => void] {
    const [value, setValue] = useState<T>(() => read(storage, key, initialValue));

    const set = useCallback(
      (next: T) => {
        try {
          storage.setItem(key, JSON.stringify(next));
          setValue(next);
        } catch {
          console.warn(`useStorage: couldn't write "${key}"`, next);
        }
      },
      [key],
    );

    const remove = useCallback(() => {
      try {
        storage.removeItem(key);
        setValue(initialValue);
      } catch {
        console.warn(`useStorage: couldn't remove "${key}"`);
      }
    }, [key, initialValue]);

    return [value, set, remove];
  };
}
