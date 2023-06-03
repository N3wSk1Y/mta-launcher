import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from "path";
import {GameFilesHandler} from "./entities/GameFilesHandler";
import {ConfigManager} from "./entities/ConfigManager";
require('dotenv').config()

export const configManager = new ConfigManager();
export const gameFilesHandler = new GameFilesHandler("C:\\Users\\Dmitry\\WebstormProjects\\mta-launcher\\test_gamepath");
export let mainWindow: BrowserWindow;

require('update-electron-app')({
    repo: 'n3wsk1y/gta-derzhava',
    updateInterval: '10 minutes',
    logger: require('electron-log')
});

const createWindow = async () => {
    mainWindow = new BrowserWindow({
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
    console.log(process.env.FTP_HOST)
    mainWindow.loadFile('src/index.html')

    ipcMain.handle('connectToServer', async (event, args) => {
        mainWindow.webContents.send('changeStatus', 1)
        await gameFilesHandler.CheckGameFiles(async () => {
            mainWindow.webContents.send('changeStatus', 2)
        })
    })
    ipcMain.handle('getDirectory', getDirectory)
    ipcMain.on('closeApp', () => app.quit());
    ipcMain.on('minimizeApp', () => mainWindow.minimize());

    mainWindow.webContents.on('did-finish-load',  () => {
        mainWindow.webContents.send('syncGamePath', configManager.getData("gamefilesDirectory"))
        mainWindow.webContents.send('syncBetaKey', configManager.getData("beta_key"))
    })
}

if (require('electron-squirrel-startup'))
    app.quit();

app.whenReady().then(async () => {
    await createWindow()

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