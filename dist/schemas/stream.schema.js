"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateStream = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateStream = (0, express_validator_1.checkSchema)({
    videoPath: {
        in: ['body'],
        isString: {
            errorMessage: 'Video path must be a string',
        },
        notEmpty: {
            errorMessage: 'Video path is required',
        }
    },
    rtmpTarget: {
        in: ['body'],
        isString: {
            errorMessage: 'rtmp Target must be a string',
        },
        notEmpty: {
            errorMessage: 'rtmp Target is required',
        }
    },
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string',
        },
        notEmpty: {
            errorMessage: 'name is required',
        }
    }
});
