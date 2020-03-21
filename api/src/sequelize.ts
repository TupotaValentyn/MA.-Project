import { Sequelize } from 'sequelize-typescript';

import config from "./config";

import { User } from './models';

export default async () => {
    const sequelize = new Sequelize({
        database: config.DB_NAME,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        dialect: 'mysql',
        define: {
            freezeTableName: false,
            timestamps: true,
        }
    });

    sequelize.addModels([User]);

    // await sequelize.sync({ alter: true });
}
