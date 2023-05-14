export class GameFilesHandler {
    public gamePath: string;
    public currentVersion: number;

    public constructor(gamePath: string, currentVersion: number) {
        this.gamePath = gamePath;
        this.currentVersion = currentVersion;
    }

    public UpdateFiles(): void {

    }
}