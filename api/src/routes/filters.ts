import express from 'express';

import { translateText } from '../util';
import { authorized } from '../guards';

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
 *      security:
 *        - default: []
 *
 */
router.get('/', authorized, async (request, response) => {
    const categories = await Category.findAll();
    const costs = await Cost.findAll();
    const restDurations = await Duration.findAll();
    const companySizes = await CompanySize.findAll();

    response.json({
        categories: categories.map((category) => ({ id: category.id, name: translateText(category.nameTextId, request.locale) })),
        costs: costs.map((cost) => ({ id: cost.id, name: translateText(cost.nameTextId, request.locale) })),
        restDurations: restDurations.map((duration) => ({ id: duration.id, name: translateText(duration.nameTextId, request.locale) })),
        companySizes: companySizes.map((companySize) => ({ id: companySize.id, name: translateText(companySize.nameTextId, request.locale) })),
    });
});

export default router;
