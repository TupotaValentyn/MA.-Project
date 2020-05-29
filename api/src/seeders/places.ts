import logger from '../logger';
import { RestPlace } from '../models';
import loadPlaces from '../loadPlaces';

export default async () => {
    logger.info('RestPlace - Start');

    const placesCount = await RestPlace.count();

    if (!placesCount) {
        await loadPlaces();
    }

    logger.info('RestPlace - Done');
};
