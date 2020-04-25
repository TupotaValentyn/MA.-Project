import express from 'express';

import { translateText } from '../util';

import {
    Category, CompanySize, Cost, Duration
} from '../models';

const router = express.Router();

/**
 * @swagger
 * /filters:
 *    get:
 *      tags:
 *        - Filters
 *      summary: "Позволяет получить данные о статичных фильтрах: категориях, длительностях отдыха, стоимостях отдыха и размерах компании"
 *      responses:
 *        '200':
 *          description: "Данные фильтров успешно получены."
 *
 */
router.get('/', async (request, response) => {
    const categories = await Category.findAll();
    const costs = await Cost.findAll();
    const restDurations = await Duration.findAll();
    const companySizes = await CompanySize.findAll();

    response.json({
        categories: categories.map((category) => ({ id: category.id, name: translateText(category.nameTextId) })),
        costs: costs.map((cost) => ({ id: cost.id, name: translateText(cost.nameTextId) })),
        restDurations: restDurations.map((duration) => ({ id: duration.id, name: translateText(duration.nameTextId) })),
        companySizes: companySizes.map((companySize) => ({ id: companySize.id, name: translateText(companySize.nameTextId) })),
    });
});

export default router;
