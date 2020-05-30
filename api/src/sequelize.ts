import { Sequelize } from 'sequelize-typescript';

import config from './config';
import logger from './logger';

import {
    User, WorkingPeriod, RestPlace, Category, Review, RestPlaceCategory
} from './models';

export default async (): Promise<Sequelize> => {
    logger.info('Connecting to DB...');
    logger.info(`DB_NAME=${config.DB_NAME}`);
    logger.info(`DB_HOST=${config.DB_HOST}`);

    const sequelize = new Sequelize({
        host: config.DB_HOST,
        database: config.DB_NAME,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        dialect: 'mysql',
        logging: false,
        define: {
            freezeTableName: false,
            timestamps: false,
            underscored: true,
        },
        dialectOptions: {
            charset: 'utf8mb4',
        },
    });

    sequelize.addModels([
        User,
        Review,
        Category,
        RestPlace,
        WorkingPeriod,
        RestPlaceCategory
    ]);

    await sequelize.sync({
        alter: true
    });

    logger.info('Connected to DB');

    return sequelize;
};
