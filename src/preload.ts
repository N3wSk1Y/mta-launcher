import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    // Front to Back
    connectToServer: () => ipcRenderer.invoke('connectToServer'),
    getDirectory: () => ipcRenderer.invoke('getDirectory'),
    updatesGameFiles: () => ipcRenderer.invoke('updateGameFiles'),
    closeApp: () => ipcRenderer.send('closeApp'),
    minimizeApp: () => ipcRenderer.send('minimizeApp'),

    // Back to Front
    changeStatus: (callback: any) => ipcRenderer.on('changeStatus', callback),
    syncGamePath: (callback: any) => ipcRenderer.on('syncGamePath', callback),
    syncBetaKey: (callback: any) => ipcRenderer.on('syncBetaKey', callback)
})