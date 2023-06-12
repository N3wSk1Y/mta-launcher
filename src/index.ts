import { app, BrowserWindow, ipcMain, dialog, autoUpdater } from 'electron';
import * as path from "path";
import {GameFilesHandler} from "./entities/GameFilesHandler";
import {ConfigManager} from "./entities/ConfigManager";
const ChildProcess = require('child_process');

export const configManager = new ConfigManager();
export const gameFilesHandler = new GameFilesHandler("C:\\Users\\Dmitry\\WebstormProjects\\mta-launcher\\test_gamepath");
export let mainWindow: BrowserWindow;

if (require('electron-squirrel-startup'))
    app.quit();

app.setName("GTA DERZHAVA")

console.log(process.argv)

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
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

autoUpdater.on('update-downloaded', (ev, info) => {
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 5000)
})

autoUpdater.setFeedURL({url: `https://gta-derzhava.vercel.app/update/win32/${app.getVersion()}`})
setTimeout(() => {
    for (const atribute in process.argv) {
        if (atribute === '--squirrel-firstrun')
            return
    }
    autoUpdater.checkForUpdates()
}, 30000)

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

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command: any, args: any) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args: any) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};