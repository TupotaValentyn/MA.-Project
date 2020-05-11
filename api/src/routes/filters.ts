import express from 'express';

import { authorized } from '../interceptors';
import { translateText } from '../util';

import {
    Categories, CompanySizes, RestCosts, RestDurations, RestTypes,
} from '../staticModels';

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
router.get('/', authorized, (request, response) => {
    const categories = Categories.getAll()
        .map((category) => ({ id: category.id, name: translateText(category.nameTextId, request.locale) }));

    const costs = RestCosts.getAll()
        .map((cost) => ({ id: cost.id, name: translateText(cost.nameTextId, request.locale) }));

    const restDurations = RestDurations.getAll()
        .map((duration) => ({ id: duration.id, name: translateText(duration.nameTextId, request.locale) }));

    const companySizes = CompanySizes.getAll()
        .map((companySize) => ({ id: companySize.id, name: translateText(companySize.nameTextId, request.locale) }));

    response.json({
        categories,
        costs,
        restDurations,
        companySizes,
    });
});

export default router;
