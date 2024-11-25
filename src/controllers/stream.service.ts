import Ffmpeg from "fluent-ffmpeg";
import logger from "../logger";

export class StreamService {


    public async create(stream: Stream): Promise<void> {
        return Ffmpeg({source: stream.videoPath, timeout: 0})
            .inputOption('-stream_loop', '-1')
            .inputOption('-re')
            .addOption('-pix_fmt', 'yuvj420p')
            .addOption('-b:v', '6800k')
            .addOption('-minrate', '6800k')
            .addOption('-maxrate', '6800k')
            .addOption('-bufsize', '13600k')
            .addOption('-b:a', '320k')
            .addOption('-ar', '44100')
            .addOption('-vcodec', 'libx264')
            .addOption('-acodec', 'aac')
            .addOption('-preset', 'medium')
            .addOption('-r', '30')
            .addOption('-g', '120')
            .addOption('-tune', 'zerolatency')
            .addOption('-threads', '4')
            .addOption('-f', 'flv')
            .addOption('-reconnect', '1')
            .addOption('-reconnect_streamed', '1')
            .addOption('-reconnect_delay_max', '5')
            .output(stream.rtmpTarget)
            .on('start', function(commandLine) {
                logger.info('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', function(err) {
                logger.error('An error occurred: ' + err.message);
            })
            .run();
    }
}
