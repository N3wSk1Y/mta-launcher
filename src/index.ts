import { app, BrowserWindow } from 'electron';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 600,
        resizable: false,
        fullscreenable: false,
        transparent: true,
        autoHideMenuBar: true
    })

    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})