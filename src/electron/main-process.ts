import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

export function setupGlobalStateIPC() {
  const state: Record<string, unknown> = {};

  ipcMain.on('electron_state_ipc:synchronize', (event: IpcMainEvent) => {
    event.sender.send('electron_state_ipc:synchronize', state);
  });

  ipcMain.on('electron_state_ipc:update', (event: IpcMainEvent, key: string, value) => {
    const windowsToUpdate = BrowserWindow.getAllWindows().filter((window) => window.webContents.id !== event.sender.id);

    state[key] = value;

    windowsToUpdate.forEach((window) => {
      window.webContents.send('electron_state_ipc:update', key, value);
    });
  });

  return { state };
}
