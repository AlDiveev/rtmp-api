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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesList = exports.storageList = void 0;
const storage_service_1 = require("./storage.service");
const config_1 = require("../config/config");
const storageList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storageService = new storage_service_1.StorageService(config_1.config.storageDir);
    const storages = yield storageService.storageList();
    return res.status(200).json({ storages });
});
exports.storageList = storageList;
const filesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = req.params.name;
    const storageService = new storage_service_1.StorageService(config_1.config.storageDir + storage);
    const storages = yield storageService.filesList();
    return res.status(200).json({ storages });
});
exports.filesList = filesList;
