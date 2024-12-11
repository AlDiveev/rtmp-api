import {StreamService} from './stream.service';
import {validationResult} from 'express-validator';
import {Request} from 'express';
import logger from "../logger";
import {converts} from "../app";
import {existsSync} from 'node:fs';
import {config} from "../config/config";


const workers: Map<string, WorkerInfo> = new Map();

interface WorkerInfo {
    ffmpeg: any;
    status: string;
}

export const create = async (req: Request, res: any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const stream: Stream = req.body;
    const streamService = new StreamService();

    try {
        const ffmpeg = await streamService.startRtmpStream(stream.videoPath, stream.rtmpTarget);
        workers.set(stream.name, {ffmpeg: ffmpeg, status: 'running'});

        return res.status(200).json({
            message: 'Stream created',
            stream: stream,
        });

    } catch (error) {
        logger.error('Error creating stream:', error);
        return res.status(500).json({message: 'Error creating stream', error: (error as Error).message});
    }
};

export const checkSource = (req: Request, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const video: any = req.body;
    const convert = converts.get(video.videoName);

    const flvFilePath = config.tempStorageDir + video.session + "/" + video.videoName.replace(".mp4", '') + ".flv";

    if (convert?.status == 'in_progress') {
        return res.status(200).json({message: 'File is in_progress',});
    } else {
        if (existsSync(flvFilePath)) {
            return res.status(200).json({message: 'File is ready for streaming'});
        }

        return res.status(400).json({message: 'File not found',});
    }
};

export const list = (req: any, res: any) => {

    const activeProcesses =
        Array.from(workers.entries()).map(([name, worker]) => (
            {
                name,
                spawnargs: worker.ffmpeg.ffmpegProc.spawnargs,
                status: worker.status,
            }

        ));

    return res.status(200).json({activeProcesses});
};


export const stop = (req: any, res: any) => {
    const processId = req.params.id;
    const worker = workers.get(processId);

    if (worker) {
        workers.delete(processId);
        worker.ffmpeg.kill('SIGKILL');

        return res.status(200).json({message: `Stream ${processId} killed`});
    } else {
        return res.status(404).json({message: `Stream ${processId} not found`});
    }
};
