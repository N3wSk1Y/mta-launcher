import {HTTPClient} from "./HTTPClient";
import * as path from "path";
import {configManager, mainWindow} from "../index";
import decompress from 'decompress';
import * as fs from "fs";
const decompressUnzip = require('decompress-unzip');
const appconfig = require('../../appconfig.json');

export class GameFilesHandler {
    get currentVersion(): number {
        return this._currentVersion;
    }
    public gamePath: string;
    private _currentVersion: number;
    private versionsManifest: any;

    public constructor(gamePath: string, currentVersion: number) {
        this.gamePath = gamePath;
        this._currentVersion = configManager.getData("installed_version") | currentVersion;
        this.GetVersionsManifest()
    }

    public async GetVersionsManifest(): Promise<void> {
        const versionsManifest = await HTTPClient.Request({
            'method': 'GET',
            'url': appconfig.gamefiles.versions_manifest_url,
            'headers': {
                'Content-Type': ' application/x-www-form-urlencoded'
            },
            'gzip': true
        }) as any
        this.versionsManifest = JSON.parse(versionsManifest);
    }

    public IsActualVersion(): boolean {
        return this.versionsManifest.current_version == this.currentVersion;
    }

    public async UpdateGameFiles(callback: CallableFunction): Promise<void> {
        const actual_version = this.versionsManifest.versions.filter((el: { id: number; }) => el.id === this.versionsManifest.current_version)[0]
        await HTTPClient.Download(path.join(appconfig.gamefiles.files_url, actual_version.path), path.join(configManager.getData("gamefilesDirectory"), "gamefiles.zip"), async (fileName: string, progress: number) => {
            mainWindow.webContents.on('did-finish-load',  () => {
                mainWindow.webContents.send('handleDownloading', { fileName, progress })
            })
        },async () => {
            await this.DecompressGameFiles()
            fs.unlink(path.join(configManager.getData("gamefilesDirectory"), "gamefiles.zip"), () => {
                return new Promise(() => callback())
            })
        })
        this._currentVersion = this.versionsManifest.current_version;
        configManager.setData("installed_version", this.currentVersion);
    }

    private async DecompressGameFiles(): Promise<void> {
        mainWindow.webContents.send('handleDownloading', 100)
        await decompress(path.join(configManager.getData("gamefilesDirectory"), "gamefiles.zip"), configManager.getData("gamefilesDirectory"),
        {
            plugins: [
                decompressUnzip()
            ]
        })
    }
}