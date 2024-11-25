import pino from 'pino';

const logger = pino({
        level: 'info',
        transport: {
            targets: [
                {
                    target: 'pino-pretty',
                },
                {
                    target: 'pino-pretty',
                    options: {
                        destination: "./logs/app.log",
                        colorize: false,
                    },
                }

            ],
        },
    },
);

export default logger;
