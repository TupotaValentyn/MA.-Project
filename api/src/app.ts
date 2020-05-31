import initServer from './server';
import logger from './logger';

initServer().catch((error) => {
    logger.fatal(error.message);
    process.exit(1);
});
