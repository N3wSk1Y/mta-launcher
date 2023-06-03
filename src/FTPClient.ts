import fs from "fs";

const ftp = require('basic-ftp')
const appconfig = require('../appconfig.json')
const replaceall = require("replaceall");

export class FTPClient {
    public static readonly ftpClient = new ftp.Client()
    private static readonly options: object = {
        'host': appconfig.ftp_client.host,
        'user': appconfig.ftp_client.user,
        'password': appconfig.ftp_client.password,
    }

    public static async Auth(): Promise<void> {
        await this.ftpClient.access(this.options);
    }

    public static async Close(): Promise<void> {
        await this.ftpClient.close();
    }

    public static async DownloadFile(fileName: string, path: string): Promise<any> {
        try {
            const writeStream = fs.createWriteStream(path);
            await this.ftpClient.downloadTo(writeStream, replaceall("\\", "/", fileName))
        }
        catch(err) { console.log(err) }
    }
}