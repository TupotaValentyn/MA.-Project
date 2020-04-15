import { Sequelize } from 'sequelize-typescript';

import config from './config';

import {
    User, CompanySize, Duration, WorkingPeriod, Cost, RestPlace, Category, Review, RestPlaceCategory
} from './models';

export default (): Sequelize => {
    const sequelize = new Sequelize({
        database: config.DB_NAME,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        dialect: 'mysql',
        logging: false,
        define: {
            freezeTableName: false,
            timestamps: false,
        },
    });

    sequelize.addModels([User, CompanySize, Review, Category, RestPlace, Cost, WorkingPeriod, Duration, RestPlaceCategory]);

    return sequelize;
};
