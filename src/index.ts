import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from "path";
import {GameFilesHandler} from "./gamefileshandler/GameFilesHandler";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
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
    })

    mainWindow.loadFile('src/index.html')

    ipcMain.handle('playGame', async (event, args) => {
        gameFilesHandler.UpdateFiles()
        console.log("Updating...")
    })

    ipcMain.handle('getDirectory', getDirectory)

    ipcMain.on('closeApp', () => app.quit());
    ipcMain.on('minimizeApp', () => mainWindow.minimize());
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

async function getDirectory (): Promise<string> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Выберите папку с игрой",
        properties: ["openDirectory"],
        buttonLabel: "Выбрать папку",
        defaultPath: "/Users/<username>/",
    })
    if (!canceled) {
        console.log(filePaths[0])
        return filePaths[0]
    } else {
        return "";
    }
}