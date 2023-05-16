import FTPS, {FTPOptions} from 'ftps';

export class GameFilesHandler {
    public gamePath: string;
    public currentVersion: number;
    private ftpServer: FTPS;


    public constructor(gamePath: string, currentVersion: number, ftpOptions: FTPOptions) {
        this.gamePath = gamePath;
        this.currentVersion = currentVersion;
        this.ftpServer = new FTPS(ftpOptions);
    }

    public UpdateFiles(): void {

    }
}