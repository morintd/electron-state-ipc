/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from 'react';

import { useElectronStateIPC } from './provider';

type UseStateIPCType<T> = [T, (value: T | ((value: T) => T)) => void];

function useStateIPC<T = undefined>(keyIPC: string, initialValue: T): UseStateIPCType<T> {
  const state = useElectronStateIPC();

  const [stateValue, setStateValue] = useState<T>(() => {
    return state.get<T>(keyIPC) || initialValue;
  });

  useEffect(() => {
    // @ts-expect-error We need to add electron_react_state to window.
    window.electron_react_state.onState<T>((_, key: string, value: unknown) => {
      if (key === keyIPC) setStateValue(value as T);
    });
  }, []);

  function setValue(value: T | ((value: T) => T)) {
    try {
      const valueToStore = value instanceof Function ? value(stateValue) : value;
      setStateValue(valueToStore);
      state.update<T>(keyIPC, valueToStore);
    } catch (error) {
      // console.log(error);
    }
  }

  return [stateValue, setValue];
}

export default useStateIPC;
