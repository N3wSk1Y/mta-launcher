import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    connectToServer: () => ipcRenderer.invoke('connectToServer'),
    getDirectory: () => ipcRenderer.invoke('getDirectory')
})