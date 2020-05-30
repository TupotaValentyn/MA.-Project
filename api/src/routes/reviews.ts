import express from 'express';

import { authorized } from '../interceptors';
import { reviewsController } from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /reviews:
 *    get:
 *      tags:
 *        - Reviews
 *      summary: "Позволяет получить отзывы к заведению по его ID"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "query"
 *          name: "placeId"
 *          description: "ID заведения, для которого нужно получить отзывы"
 *      responses:
 *        '200':
 *          description: "Отзывы успешно получены. Возвращает список отзывов вида ```{ reviews: ReviewModel[] }```"
 *        '400':
 *          description: "Неправильный запрос. Не передан ID заведения или заведение не найдено"
 *      security:
 *        - default: []
 *
 */
router.get('/', authorized, reviewsController.getReviews);

/**
 * @swagger
 * /reviews/add:
 *    post:
 *      tags:
 *        - Reviews
 *      summary: "Позволяет добавить отзыв на заведение"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "placeId"
 *          description: "ID заведения, для которого добавляется отзыв"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "comment"
 *          description: "Текст отзыва [5-1000 символов]"
 *          schema:
 *            type: string
 *        - in: "body"
 *          name: "rating"
 *          description: "Оценка отзыва [1-5]"
 *          schema:
 *            type: number
 *      responses:
 *        '200':
 *          description: "Отзыв успешно добавлен. Возвращает модель добавленного отзыва, измененное кол-во отзывов и
 *          новую среднюю оценку заведения вида ```{ review: ReviewModel, placeReviewCount: number, placeMeanRating: number }```"
 *        '400':
 *          description: "Неправильный запрос. Не передан ID заведения, заведение не найдено или переданы неправильные параметры"
 *      security:
 *        - default: []
 *
 */
router.post('/add', authorized, reviewsController.addReview);

/**
 * @swagger
 * /reviews/remove:
 *    post:
 *      tags:
 *        - Reviews
 *      summary: "Позволяет удалить отзыв по его ID"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "reviewId"
 *          description: "ID отзыва, который нужно удалить"
 *          schema:
 *            type: number
 *      responses:
 *        '200':
 *          description: "Отзыв успешно удален. Возвращает измененное кол-во отзывов и
 *          новую среднюю оценку заведения вида ```{ removed: boolean, placeReviewCount: number, placeMeanRating: number }```"
 *        '400':
 *          description: "Неправильный запрос. Не передан ID отзыва или отзыв не найден"
 *        '403':
 *          description: "Действие запрещено. Текущему пользователю нельзя удалить этот
 *          запрос (пользователю можно удалить только свой отзыв, администратор может удалить любой отзыв)"
 *      security:
 *        - default: []
 *
 */
router.post('/remove', authorized, reviewsController.removeReview);

export default router;
