import * as fs from 'fs/promises';

export class StorageService {

    private storageDir: string;

    constructor(storageDir: string) {
        this.storageDir = storageDir;
    }

    public async storageList(): Promise<string[]> {
        try {
            const entries = await fs.readdir(this.storageDir, {withFileTypes: true});
            const subdirectories = entries
                .filter((entry) => entry.isDirectory())
                .map((entry) => entry.name);

            return subdirectories;
        } catch (error) {
            console.error('Error reading storage directory:', error);
            throw new Error('Unable to list directories');
        }
    }


    public async filesList(): Promise<string[]> {
        try {
            const entries = await fs.readdir(this.storageDir, {withFileTypes: true});
            const files = entries
                .filter((entry) => entry.isFile())
                .map((entry) => entry.name);

            return files;
        } catch (error) {
            console.error('Error reading storage directory:', error);
            throw new Error('Unable to list files');
        }
    }
}
