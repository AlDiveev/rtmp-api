import {StreamService} from './stream.service';
import {validationResult} from 'express-validator';
import {Request} from 'express';
import {config} from "../config/config";
import logger from "../logger";

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
    stream.videoPath = config.storageDir + stream.videoPath;
    const streamService = new StreamService();

    try {
        const ffmpeg = await streamService.create(stream);
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
