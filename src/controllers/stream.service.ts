import Ffmpeg, {FfmpegCommand} from "fluent-ffmpeg";
import logger from "../logger";
import {config} from "../config/config";
import { converts } from "../app";


export class StreamService {

    public async startRtmpStream(fileName: string, rtmpTarget: string): Promise<void> {

        return Ffmpeg({source: config.tempStorageDir + fileName, timeout: 0})
            .inputOptions('-re')
            .inputOptions('-stream_loop', '-1')
            .outputOptions('-c copy')
            .format('flv')
            .output(rtmpTarget)
            .on('start', function (commandLine) {
                logger.info('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', function (err) {
                logger.error('Stream start error: ' + err.message);
            })
            .run();
    }

    public async convertToFlv(fileName: string): Promise<FfmpegCommand> {

        converts.set(fileName, { name: fileName, status: 'in_progress' });

        return Ffmpeg(config.storageDir + fileName)
            .videoCodec('libx264')
            .videoBitrate(1500)
            .outputOptions([
                '-maxrate 1500k',
                '-bufsize 3000k',
                '-vf scale=1280:720',
                '-r 25'
            ])
            .audioCodec('aac')
            .audioBitrate('96k')
            .audioFrequency(44100)
            .format('flv')
            .on('start', function (commandLine) {
                logger.info('Spawned Ffmpeg convert: ' + commandLine);
            })
            .on('error', function (err) {
                logger.error('Convert error: ' + err.message);
            })
            .on('end', function () {
                converts.delete(fileName);
                logger.info('Convert successfully finished!');
            })
            .save(config.tempStorageDir + fileName);
    }
}
