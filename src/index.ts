import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from "path";
import {GameFilesHandler} from "./entities/GameFilesHandler";
import {ConfigManager} from "./entities/ConfigManager";
import { autoUpdater } from 'electron-updater'

export const configManager = new ConfigManager();
export const gameFilesHandler = new GameFilesHandler("C:\\Users\\Dmitry\\WebstormProjects\\mta-launcher\\test_gamepath");
export let mainWindow: BrowserWindow;

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.setFeedURL(`https://update.electronjs.org/N3wSk1Y/gta-derzhava/win32-x64/${app.getVersion()}`)

app.setName("GTA DERZHAVA")

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, "public", "icon2.ico"),
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

app.whenReady().then(async () => {
    await createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    await autoUpdater.checkForUpdatesAndNotify();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

autoUpdater.on("update-available", async () => {
    const dialogOpts: any = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Обновление лаунчера',
        message: "Обновление лаунчера\n"+path,
        detail: 'Новая версия лаунчера готова к скачиванию.'
    }
    await dialog.showMessageBox(dialogOpts);
})

autoUpdater.on("update-downloaded", async () => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Перезагузить', 'Позже'],
        title: 'Обновление лаунчера',
        message: "Обновление лаунчера",
        detail: 'Новая версия лаунчера загружена. Перезагрузите лаунчер для обновления.'
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
});

process.on("uncaughtException", async (err) => {
    await dialog.showMessageBox({
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