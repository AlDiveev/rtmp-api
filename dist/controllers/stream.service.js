"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const logger_1 = __importDefault(require("../logger"));
class StreamService {
    create(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fluent_ffmpeg_1.default)({ source: stream.videoPath, timeout: 0 })
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
                .on('start', function (commandLine) {
                logger_1.default.info('Spawned Ffmpeg with command: ' + commandLine);
            })
                .on('error', function (err) {
                logger_1.default.error('An error occurred: ' + err.message);
            })
                .run();
        });
    }
}
exports.StreamService = StreamService;
