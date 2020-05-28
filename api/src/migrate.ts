import Categories from './staticModels/Categories';
import { Category, User } from './models';
import loadPlaces from './loadPlaces';

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
