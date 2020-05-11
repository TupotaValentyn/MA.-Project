import { Sequelize } from 'sequelize-typescript';

import config from './config';

import {
    User, WorkingPeriod, RestPlace, Category, Review, RestPlaceCategory
} from './models';

import Categories from './staticModels/Categories';

export default async (): Promise<Sequelize> => {
    const sequelize = new Sequelize({
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

    // eslint-disable-next-line no-use-before-define
    await populateDB(sequelize);

    return sequelize;
};

async function populateDB(sequelizeInstance: Sequelize) {
    await sequelizeInstance.sync({ alter: true });

    console.log('Categories - Start');

    // eslint-disable-next-line no-restricted-syntax,no-use-before-define
    for (const categoryData of Categories.getAll()) {
        // eslint-disable-next-line no-await-in-loop
        const categoryModel = await Category.findOne({
            where: { googleId: categoryData.googleId }
        });

        if (!categoryModel) {
            // eslint-disable-next-line no-await-in-loop
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
}
