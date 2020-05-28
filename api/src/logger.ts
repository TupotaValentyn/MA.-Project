import { getLogger } from 'log4js';

const logger = getLogger();

logger.level = process.env.NODE_ENV === 'production' ? 'debug' : 'info';

export default logger;
