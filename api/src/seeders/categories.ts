import logger from '../logger';
import Categories from '../staticModels/Categories';
import { Category } from '../models';

export default async () => {
    logger.info('Categories - Start');

    for (const categoryData of Categories.getAll()) {
        const categoryModel = await Category.findOne({
            where: { googleId: categoryData.googleId }
        });

        if (!categoryModel) {
            await Category.create(categoryData);
        }
    }

    logger.info('Categories - Done');
};
