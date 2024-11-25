import { checkSchema } from 'express-validator';

export const validateCreateStream = checkSchema({
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
