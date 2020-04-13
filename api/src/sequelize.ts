import { Sequelize } from 'sequelize-typescript';

import config from './config';

import {
    User, CompanySize, Duration, BusinessHours, Cost, RestPlace, Category, Review,
} from './models';

export default (): Sequelize => {
    const sequelize = new Sequelize({
        database: config.DB_NAME,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        dialect: 'mysql',
        define: {
            freezeTableName: false,
            timestamps: true,
        },
        logging: false,
    });

    sequelize.addModels([User, CompanySize, Review, Category, RestPlace, Cost, BusinessHours, Duration]);

    return sequelize;
};
