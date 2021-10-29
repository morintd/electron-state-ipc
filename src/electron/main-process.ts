import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

export function setupGlobalStateIPC() {
  const state: Record<string, unknown> = {};

  function synchronizeStateIPC(window: BrowserWindow) {
    window.webContents.on('did-finish-load', () => {
      window.webContents.send('electron_react_state:synchronize', state);
    });
  }

  ipcMain.on('electron_react_state:update', (event: IpcMainEvent, key: string, value) => {
    const windowsToUpdate = BrowserWindow.getAllWindows().filter((window) => window.webContents.id !== event.sender.id);

    state[key] = value;

    windowsToUpdate.forEach((window) => {
      window.webContents.send('electron_react_state:update', key, value);
    });
  });

  return { state, synchronizeStateIPC };
}
