import logger from '../logger';
import connectToSequelize from '../sequelize';

import insertCategories from './categories';
import insertUsers from './users';
import insertPlaces from './places';

(async () => {
    try {
        await connectToSequelize();

        logger.info('Seeding - Start');

        await insertCategories();
        await insertUsers();
        await insertPlaces();

        logger.info('Seeding - Done');
    } catch (error) {
        logger.error('Seeding - Failed');
        logger.error(error.message);
    }
})();
