import { Sequelize } from 'sequelize-typescript';

import config from './config';

import {
    User, CompanySize, Duration, WorkingPeriod, Cost, RestPlace, Category, Review, RestPlaceCategory
} from './models';

export default (): Sequelize => {
    console.log('Connecting to DB...');
    console.log(`DB_NAME=${config.DB_NAME}`);
    console.log(`DB_HOST=${config.DB_HOST}`);

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

    sequelize.addModels([User, CompanySize, Review, Category, RestPlace, Cost, WorkingPeriod, Duration, RestPlaceCategory]);

    return sequelize;
};
