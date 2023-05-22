import path from "path";
import * as fs from "fs";
import {ConfigSchema} from "./ConfigSchema";
import {GameFilesHandler} from "./GameFilesHandler";
import { gameFilesHandler } from "..";
const appconfig = require('../../appconfig.json');

export class ConfigManager {
    get configData(): ConfigSchema {
        this.uploadConfig()
        return this._configData as ConfigSchema;
    }
    private _configData: ConfigSchema | undefined;
    private readonly configDirectory: string;
    private readonly configFile: string;
    private readonly gameFilesHandler: GameFilesHandler;

    public constructor() {
        this.configDirectory = path.join(process.env.home as string, "Documents", "GTA DERZHAVA");
        this.configFile = path.join(process.env.home as string, "Documents", "GTA DERZHAVA", appconfig.app.config_filename);
        this.gameFilesHandler = gameFilesHandler;
        this.checkConfig()
    }

    public getData(field: any): any {
        const configData = this.configData;
        // @ts-ignore
        return configData[`${field}`];
    }

    public setData(field: any, value: any): void {
        let configData = this.configData;
        // @ts-ignore
        configData[`${field}`] = value;
        fs.writeFile(this.configFile, JSON.stringify(configData), (err) => {
            if (err) console.log(err);
        });
    }

    private checkConfig(): void {
        try {
            if (this.checkFileExistence())
                if (this.checkConfigSchema(require(this.configFile)))
                    return;
            this.setupConfig()
        } catch (e) {
            console.log(e)
        }
    }

    private checkConfigSchema(object: any): object is ConfigSchema {
        return "installed_version" in object;
    }

    private checkFileExistence(): boolean {
        return fs.existsSync(this.configFile);
    }

    private setupConfig(): void {
        const config: ConfigSchema = {
            installed_version: this.gameFilesHandler.currentVersion,
            beta_key: "",
            gamefilesDirectory: ""
        }
        fs.mkdir(this.configDirectory, { recursive: true }, () => {
            fs.writeFile(this.configFile, JSON.stringify(config), (err) => {
                if (err) console.log(err);
            });
        })
    }

    private uploadConfig(): void {
        this._configData = require(this.configFile);
    }
}