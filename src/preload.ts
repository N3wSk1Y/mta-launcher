import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    // Front to Back
    connectToServer: () => ipcRenderer.invoke('connectToServer'),
    getDirectory: () => ipcRenderer.invoke('getDirectory'),
    closeApp: () => ipcRenderer.send('closeApp'),
    minimizeApp: () => ipcRenderer.send('minimizeApp'),

    // Back to Front
    changeStatus: (callback: any) => ipcRenderer.on('changeStatus', callback)
})