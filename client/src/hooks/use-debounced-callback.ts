import { useEffect, useMemo, useRef } from "react";

import debounce from "lodash.debounce";

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = (
  ...args: Parameters<T>
) => ReturnType<T> | undefined;

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const debouncedFunc = useRef<ReturnType<typeof debounce>>(null);

  const debounced = useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    return wrappedFunc;
  }, [func, delay, options]);

  useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options);
  }, [func, delay, options]);

  return debounced;
}
