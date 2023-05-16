import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    playGame: () => ipcRenderer.invoke('playGame'),
    getDirectory: () => ipcRenderer.invoke('getDirectory'),
    closeApp: () => ipcRenderer.send('closeApp'),
    minimizeApp: () => ipcRenderer.send('minimizeApp')
})