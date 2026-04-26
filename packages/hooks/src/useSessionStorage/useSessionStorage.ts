import { createStorageHook } from '../useStorage/useStorage';

/**
 * Same as useLocalStorage but clears when the tab closes.
 *
 * @example
 * const [step, setStep] = useSessionStorage('checkout-step', 1);
 */
export const useSessionStorage = createStorageHook(sessionStorage);
