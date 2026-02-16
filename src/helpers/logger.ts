import path from 'path';
import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';
const dataDir = process.env.DATA_DIR || '.';
const logPath = path.join(dataDir, 'logs.json');

const transport = pino.transport({
    target: 'pino/file',
    options: { destination: logPath }
});

export const logger = pino({ level: logLevel }, transport);