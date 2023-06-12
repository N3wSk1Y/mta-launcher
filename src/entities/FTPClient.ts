import fs from "fs";
require('dotenv').config()

const ftp = require('basic-ftp')
const replaceall = require("replaceall");

export class FTPClient {
    public static readonly ftpClient = new ftp.Client()
    private static readonly options: object = {
        'host': process.env.FTP_HOST,
        'user': process.env.FTP_USER,
        'password': process.env.FTP_PASSWORD,
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