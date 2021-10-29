import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

const api = {
  onGlobalState: (cb: (e: IpcRendererEvent, value: Record<string, unknown>) => void) =>
    ipcRenderer.on('electron_react_state:synchronize', cb),
  onState: <S>(cb: (e: IpcRendererEvent, key: string, value: S) => void) =>
    ipcRenderer.on('electron_react_state:update', cb),
  updateState: <S>(key: string, value: S) => ipcRenderer.send('electron_react_state:update', key, value),
};

export function exposeStateIPC() {
  contextBridge.exposeInMainWorld('electron_react_state', api);
}
