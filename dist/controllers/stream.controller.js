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
exports.stop = exports.list = exports.create = void 0;
const stream_service_1 = require("./stream.service");
const express_validator_1 = require("express-validator");
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../logger"));
const workers = new Map();
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const stream = req.body;
    stream.videoPath = config_1.config.storageDir + stream.videoPath;
    const streamService = new stream_service_1.StreamService();
    try {
        const ffmpeg = yield streamService.create(stream);
        workers.set(stream.name, { ffmpeg: ffmpeg, status: 'running' });
        return res.status(200).json({
            message: 'Stream created',
            stream: stream,
        });
    }
    catch (error) {
        logger_1.default.error('Error creating stream:', error);
        return res.status(500).json({ message: 'Error creating stream', error: error.message });
    }
});
exports.create = create;
const list = (req, res) => {
    const activeProcesses = Array.from(workers.entries()).map(([name, worker]) => ({
        name,
        spawnargs: worker.ffmpeg.ffmpegProc.spawnargs,
        status: worker.status,
    }));
    return res.status(200).json({ activeProcesses });
};
exports.list = list;
const stop = (req, res) => {
    const processId = req.params.id;
    const worker = workers.get(processId);
    if (worker) {
        workers.delete(processId);
        worker.ffmpeg.kill('SIGKILL');
        return res.status(200).json({ message: `Stream ${processId} killed` });
    }
    else {
        return res.status(404).json({ message: `Stream ${processId} not found` });
    }
};
exports.stop = stop;
