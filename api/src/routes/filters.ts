import express from 'express';

import { authorized } from '../interceptors';
import { filtersController } from '../controllers';

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
router.get('/', authorized, filtersController.getFilters);

router.get('/v2', authorized, filtersController.getFilters2);

export default router;
