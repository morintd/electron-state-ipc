import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

const api = {
  requestGlobalState: () => ipcRenderer.send('electron_state_ipc:synchronize'),
  onGlobalState: (cb: (e: IpcRendererEvent, value: Record<string, unknown>) => void) =>
    ipcRenderer.on('electron_state_ipc:synchronize', cb),
  onState: <S>(cb: (e: IpcRendererEvent, key: string, value: S) => void) => ipcRenderer.on('electron_state_ipc:update', cb),
  updateState: <S>(key: string, value: S) => ipcRenderer.send('electron_state_ipc:update', key, value),
};

export function exposeStateIPC() {
  contextBridge.exposeInMainWorld('electron_state_ipc', api);
}
