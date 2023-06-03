import request from 'request';
import fs from "fs";
import {FTPClient} from "./FTPClient";
import * as http from "http";

const parse = require('parse-apache-directory-index')
const appconfig = require('../../appconfig.json')

export class HTTPClient {
    public static async Request(options: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await request(options, function (error: any, response: any) {
                if (error) reject(error)
                resolve(response.body)
            })
        })
    }

    public static async Download(url: string, fileName: string, callback: CallableFunction): Promise<any> {
        const file = fs.createWriteStream(fileName);
        http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', () => {
                return new Promise(async () => {
                    callback()
                })
            });
        });
    }

    public static async DownloadDirectory(url: string, path: string, callback?: CallableFunction): Promise<void> {
        let filesManifest = await HTTPClient.Request({
            'method': 'GET',
            'url': url,
        })
        const {dir, files} = parse(filesManifest)

        for (let i = 0; i < files.length; i++) {
            if (files[i].type === "file") {
                await FTPClient.DownloadFile(appconfig.gamefiles.host + files[i].path, files[i].path.replace(dir, path))
            }
            else if (files[i].type === "directory") {
                const directory = files[i].path.replace(dir, path)
                if (!fs.existsSync(directory)){
                    fs.mkdirSync(directory, { recursive: true });
                }
                await this.DownloadDirectory(appconfig.gamefiles.host + files[i].path, directory)
            }
        }
        if (callback) await callback()
    }
}