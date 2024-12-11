import { checkSchema } from 'express-validator';

export const validateCheckVideo = checkSchema({
    videoName: {
        in: ['body'],
        isString: {
            errorMessage: 'Video name must be a string',
        },
        notEmpty: {
            errorMessage: 'Video name is required',
        }
    },
    session: {
        in: ['body'],
        isString: {
            errorMessage: 'session name must be a string',
        },
        notEmpty: {
            errorMessage: 'session name is required',
        }
    },
});
