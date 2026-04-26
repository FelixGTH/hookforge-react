import { createStorageHook } from '../useStorage/useStorage';

/**
 * useState that persists in localStorage. Survives page refresh.
 *
 * @example
 * const [theme, setTheme, clear] = useLocalStorage('theme', 'light');
 */
export const useLocalStorage = createStorageHook(localStorage);
