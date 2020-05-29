import cron from 'node-cron';
import loadPlaces from './loadPlaces';
import logger from './logger';

export default () => {
    cron.schedule('0 0 3 * * *', async () => {
        try {
            logger.info('Places update: Start');
            await loadPlaces();
            logger.info('Places update: Done');
        } catch (error) {
            logger.error(error.message);
            logger.error('Places update: Failed');
        }
    });
};
