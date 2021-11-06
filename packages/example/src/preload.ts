import { contextBridge, ipcRenderer } from 'electron';
import { exposeStateIPC } from 'electron-state-ipc';

export const electron = {
  openNewWindow: (path: string) => ipcRenderer.send('window:open', path),
};

contextBridge.exposeInMainWorld('electron', electron);
exposeStateIPC();
