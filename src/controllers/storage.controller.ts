import {StorageService} from './storage.service';
import {config} from "../config/config";
import multer from "multer";
import path from "path";
import fs from 'fs';


export const storageList = async (req: any, res: any) => {
    const storageService = new StorageService(config.storageDir);
    const storages = await storageService.storageList();
    return res.status(200).json({storages});
};

export const filesList = async (req: any, res: any) => {
    const storage = req.params.name;

    const uploadDir = path.join(config.storageDir, storage);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storageService = new StorageService(config.storageDir + storage);
    const storages = await storageService.filesList();
    return res.status(200).json({storages});
}

export const uploadFile = async (req: any, res: any) => {

    const dir = req.params.name;
    const uploadDir = path.join(config.storageDir, dir);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        },
    });

    const upload = multer({storage});

    upload.single('file')(req, res, (err: any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'Error uploading file'});
        }

        return res.status(200).json({message: 'File uploaded'});
    });
}

export const deleteFile = async (req: any, res: any) => {
    const dir = req.params.name;

    //decode file name from base64
    const fileName =  Buffer.from(req.params.file, 'base64').toString('ascii');

    const filePath = path.join(config.storageDir, dir, fileName);

    return fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(400).json({message: `Error removing file: ${err}`});
        }

        return res.status(200).json({message: 'File deleted'});
    });

}
