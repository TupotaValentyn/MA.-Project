import express from 'express';

import { authorized } from '../interceptors';
import { reviewsController } from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /filters:
 *    get:
 *      tags:
 *        - Reviews
 *      summary: "Позволяет получить данные о статичных фильтрах: категориях, длительностях отдыха, стоимостях отдыха и размерах компании"
 *      responses:
 *        '200':
 *          description: "Данные фильтров успешно получены."
 *      security:
 *        - default: []
 *
 */
router.get('/', authorized, reviewsController.getReviews);

export default router;
