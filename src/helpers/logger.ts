import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';

const transport = pino.transport({
    target: 'pino/file',
    options: { destination: 'logs.json' }
});

export const logger = pino({ level: logLevel }, transport);