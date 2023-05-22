import request from 'request';
import * as fs from "fs";
import * as http from "http";

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
            const length = parseInt(<string>response.headers['content-length'], 10);
            const total = length / 1048576;
            let current = 0;
            response.pipe(file);
            response.on("data", (chunk) => {
                current += chunk.length;
                console.log(`Downloading: ${(100.0 * current / length).toFixed(2)}%`)
            });
            file.on('finish', () => {
                return new Promise(async () => {
                    callback()
                })
            });
        });
    }
}