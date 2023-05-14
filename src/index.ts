import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from "path";
import {GameFilesHandler} from "./gamefileshandler/GameFilesHandler";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 725,
        resizable: false,
        fullscreenable: false,
        transparent: true,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
        // titleBarStyle: 'hidden',
        // titleBarOverlay: {
        //     color: '#0C0C0C',
        //     symbolColor: '#616162',
        //     height: 25
        // }
    })

    win.loadFile('src/index.html')

    ipcMain.on('playGame', async (event, args) => {
        gameFilesHandler.UpdateFiles()
        console.log("Updating...")
    })
}

const gameFilesHandler = new GameFilesHandler("C:\\Users\\Dmitry\\WebstormProjects\\mta-launcher\\test_gamepath", -1)

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