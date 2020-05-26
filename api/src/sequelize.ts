import { Sequelize } from 'sequelize-typescript';

// @ts-ignore
import mysql from 'mysql2/promise';

import config from './config';
import loadPlaces from './loadPlaces';

import {
    User, WorkingPeriod, RestPlace, Category, Review, RestPlaceCategory
} from './models';

import Categories from './staticModels/Categories';

export default async (): Promise<Sequelize> => {
    console.log('Check if DB exists...\n');

    const connection = await mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
    });

    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${config.DB_NAME}'`);
    const dbExists = rows && rows.length > 0;

    if (dbExists) {
        console.log('DB already exists');
    } else {
        console.log('DB doesn\'t exist, creating it.');

        await connection.execute(`CREATE DATABASE ${config.DB_NAME} /*!40100 COLLATE 'utf8mb4_general_ci' */`);

        console.log('DB created.');
    }

    console.log('\nConnecting to DB...');
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

    sequelize.addModels([User, Review, Category, RestPlace, WorkingPeriod, RestPlaceCategory]);

    await sequelize.sync({ alter: true });

    if (!dbExists) {
        await populateDB();
    }

    console.log('Connected to DB');

    return sequelize;
};

async function populateDB() {
    console.log('\nCategories - Start');

    for (const categoryData of Categories.getAll()) {
        const categoryModel = await Category.findOne({
            where: { googleId: categoryData.googleId }
        });

        if (!categoryModel) {
            await Category.create(categoryData);
        }
    }

    console.log('Categories - Done\n');

    console.log('User - Start');

    const admin = await User.findOne({
        where: { email: 'admin@test.com' }
    });

    if (!admin) {
        await User.create({
            email: 'admin@test.com',
            password: '$2b$04$6cqzfP5tUxf3L0.OEOyYM.ppXshp/cGxDST/NZZh5FPAZYgcJ88om',
            isAdmin: true,
            isConfirmed: true,
        });
    }

    const user = await User.findOne({
        where: { email: 'user@test.com' }
    });

    if (!user) {
        await User.create({
            email: 'user@test.com',
            password: '$2b$04$6cqzfP5tUxf3L0.OEOyYM.ppXshp/cGxDST/NZZh5FPAZYgcJ88om',
            isAdmin: false,
            isConfirmed: true,
        });
    }

    console.log('User - Done\n');

    await loadPlaces();
}
