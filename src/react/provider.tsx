/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState, createContext, useCallback, useContext } from 'react';

type Props = {
  children: React.ReactElement;
};

type ContextType = {
  get: <T>(key: string) => T | undefined;
  update: <T>(key: string, value: T) => void;
  initialized: boolean;
};

export const ElectronStateIPCContextDefaultValue: ContextType = {
  get: () => undefined,
  update: () => {},
  initialized: false,
};

export const ElectronStateIPCContext = createContext<ContextType>(ElectronStateIPCContextDefaultValue);

export function ElectronStateIPCContextProvider({ children }: Props) {
  const [state, setState] = useState<Record<string, unknown>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // @ts-expect-error We need to add electron_state_ipc to window.
    window.electron_state_ipc.requestGlobalState();
  }, []);

  useEffect(() => {
    // @ts-expect-error We need to add electron_state_ipc to window.
    window.electron_state_ipc.onGlobalState((_, globalState: Record<string, unknown>) => {
      setState(globalState);
      setInitialized(true);
    });
  }, [setState, setInitialized]);

  useEffect(() => {
    // @ts-expect-error We need to add electron_state_ipc to window.
    window.electron_state_ipc.onState((_, key: string, value: unknown) => {
      setState((previous) => ({
        ...previous,
        [key]: value,
      }));
    });
  }, [setState]);

  const update = useCallback(
    <T,>(key: string, value: T) => {
      // @ts-expect-error We need to add electron_state_ipc to window.
      window.electron_state_ipc.updateState(key, value);
      setState((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    [setState],
  );

  const get = <T,>(key: string) => state[key] as T;

  return (
    <ElectronStateIPCContext.Provider value={{ get, update, initialized }}>{children}</ElectronStateIPCContext.Provider>
  );
}

export const useElectronStateIPC = () => useContext(ElectronStateIPCContext);
