import { getLogger } from 'log4js';

const logger = getLogger();

const logLevels: any = {
    test: 'info',
    production: 'info',
    development: 'debug',
};

logger.level = logLevels[process.env.NODE_ENV || 'development'] || 'fatal';

export default logger;
