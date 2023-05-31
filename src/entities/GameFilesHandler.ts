import {HTTPClient} from "./HTTPClient";
import * as path from "path";
import {configManager, mainWindow} from "../index";
import decompress from 'decompress';
import * as fs from "fs";
import {FTPClient} from "../FTPClient";
const decompressUnzip = require('decompress-unzip');
const appconfig = require('../../appconfig.json');
const md5File = require('md5-file')

export class GameFilesHandler {
    public gamePath: string;
    private versionsManifest: any;
    private filesManifest: any

    public constructor(gamePath: string) {
        this.gamePath = gamePath;
        this.GetVersionsManifest()
        this.GetFilesManifest()
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

    public async GetFilesManifest(): Promise<void> {
        const filesManifest = await HTTPClient.Request({
            'method': 'GET',
            'url': appconfig.gamefiles.files_manifest_url,
            'headers': {
                'Content-Type': ' application/x-www-form-urlencoded'
            },
            'gzip': true
        }) as any
        this.filesManifest = JSON.parse(filesManifest);
    }

    public async CheckGameFiles(callback?: CallableFunction): Promise<void> {
        await FTPClient.Auth()
        for (const item of this.filesManifest) {
            const filePath = item.path
            const fileDirectory = filePath.substring(0, filePath.lastIndexOf('/'));
            const localFileDirectory = path.join(configManager.getData('gamefilesDirectory'), fileDirectory);
            const localFilePath = path.join(configManager.getData('gamefilesDirectory'), filePath);

            if (!fs.existsSync(localFilePath)) {
                fs.mkdirSync(localFileDirectory, { recursive: true });
            }
            if (!fs.existsSync(localFilePath)) {
                fs.writeFileSync(localFilePath, "");
            }
            await md5File(path.join(configManager.getData('gamefilesDirectory'), filePath)).then(async (hash: any) => {
                if (hash.toLowerCase() !== item.hash.toLowerCase()) {
                    console.log(filePath)
                    console.log(hash.toLowerCase())
                    console.log(item.hash.toLowerCase())
                    await FTPClient.DownloadFile(path.join("release-1", filePath), path.join(configManager.getData('gamefilesDirectory'), filePath))
                }
            })
        }
        return new Promise(() => {
            if (callback) callback()
        })
    }

    public async UpdateGameFiles(callback: CallableFunction): Promise<void> {
        // await HTTPClient.Download(appconfig.gamefiles.release_url, path.join(configManager.getData("gamefilesDirectory"), "release-1.zip"), async (fileName: string, progress: number) => {
        // },async () => {
        //     await this.DecompressGameFiles()
        //     fs.unlink(path.join(configManager.getData("gamefilesDirectory"), "release-1.zip"), () => {
        //         return new Promise(() => callback())
        //     })
        // })
        // await FTPClient.DownloadFile(this.versionsManifest.path, configManager.getData("gamefilesDirectory")).then(async () => {
        //     await FTPClient.Close();
        //     await this.DecompressGameFiles().then( async () => {
        //         console.log("Done!")
        //         await callback();
        //     })
        // })
    }

}