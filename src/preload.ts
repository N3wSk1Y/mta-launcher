import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    playGame: () => ipcRenderer.send('playGame')
})