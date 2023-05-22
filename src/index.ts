import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from "path";
import {GameFilesHandler} from "./entities/GameFilesHandler";
import {ConfigManager} from "./entities/ConfigManager";

const appconfig = require('../appconfig.json');
export const configManager = new ConfigManager();
export const gameFilesHandler = new GameFilesHandler("C:\\Users\\Dmitry\\WebstormProjects\\mta-launcher\\test_gamepath", -1)

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
            devTools: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('src/index.html')

    ipcMain.handle('connectToServer', async (event, args) => {
        if (await gameFilesHandler.IsActualVersion())
            mainWindow.webContents.send('changeStatus', 1)
        else
            mainWindow.webContents.send('changeStatus', 0)
    })
    ipcMain.handle('getDirectory', getDirectory)

    ipcMain.on('closeApp', () => app.quit());
    ipcMain.on('minimizeApp', () => mainWindow.minimize());
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

process.on("uncaughtException", (err) => {
    dialog.showMessageBoxSync({
        type: "error",
        title: "Произошла ошибка",
        message: err.message
    });
    app.exit(1);
});

async function getDirectory (): Promise<string> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Выберите папку с игрой",
        properties: ["openDirectory"],
        buttonLabel: "Выбрать папку"
    })
    if (!canceled) {
        configManager.setData("gamefilesDirectory", filePaths[0])
        return filePaths[0]
    } else {
        throw new Error("Выберите папку с игрой.")
    }
}