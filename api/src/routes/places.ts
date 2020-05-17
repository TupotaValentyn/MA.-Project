import express from 'express';

import { authorized, protectedRoute } from '../interceptors';

import { placesController } from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /placesController:
 *    get:
 *      tags:
 *        - Places
 *      summary: "Позволяет получить список мест, которые подходят под значения переданных фильтров"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "query"
 *          name: "categories"
 *          description: "Список id категорий из которых нужно осуществлять поиск заведений. Валидные значения - [1-15].
 *          Если не передано или не передано хотя бы 1 валидного значения - производится выборка из всех категорий"
 *          schema:
 *            type: number[]
 *        - in: "query"
 *          name: "restCost"
 *          description: "Значение фильтра стоимости отдыха. Валидные значения - [1-5]. Если не передано или передано
 *          невалидное значение - производится выборка по всем стоимостям"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "restDuration"
 *          description: "Значение фильтра длительности отдыха. Валидные значения - [1-3]. Если не передано или передано
 *          невалидное значение - производится выборка по всем длительностям"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "companySize"
 *          description: "Значение фильтра размера компании для отдыха в этом заведении. Валидные значения - [1-4].
 *          Если не передано или передано невалидное значение - производится выборка по всем размерам"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "restType"
 *          description: "Значение фильтра типа отдыха в заведении. Валидные значения - [1 (активный) - 2 (пассивный)].
 *          Если не передано или передано невалидное значение - производится выборка по всем типам"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "workingOnly"
 *          description: "Если передать значение 1, в выборку попадут только те места, которые сейчас работают"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "distance"
 *          description: "Значение фильтра максимального расстояния до заведения. Валидные значения - [0.5-15].
 *          Также необходимо передать текущие гео-координаты пользователя (поля userLatitude, userLongitude).
 *          Они будут служить центром круга зоны поиска, а значение distance будет радиусом этого круга"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "confirmed"
 *          description: "Значение фильтра статуса заведения: подтвержденное/новое. Можно использовать для админки.
 *          Валидные значения - [1 - Показать подтвержденные, 2 - Показать неподтвержденные (пользователи кинули запрос на добавление нового места,
 *          и оно не было еще подтверждено)]"
 *          schema:
 *            type: number
 *      responses:
 *        '200':
 *          description: "Список заведений успешно получен. В ответ клиент получит список мест, которые подходят
 *          под переданные фильтры. Ответ имеет вид ```{ placesController: RestPlaceModel[] }```"
 *      security:
 *        - default: []
 *
 */
router.get('/', authorized, placesController.getPlacesByFilters);

/**
 * @swagger
 * /placesController:
 *    post:
 *      tags:
 *        - Places
 *      summary: "Позволяет удалить заведения из БД по их ID. Требует прав администратора"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "ids"
 *          description: "Список id заведений, которые нужно удалить"
 *          schema:
 *            type: number[]
 *      responses:
 *        '200':
 *          description: "Статус операции: true если заведения были удалены. Ответ имеет вид ```{ removed: boolean }```"
 *        '400':
 *          description: "Неправильный запрос: ids не передан или передан пустой массив"
 *      security:
 *        - default: []
 *
 */
router.post('/delete', authorized, protectedRoute, placesController.deletePlaces);

router.post('/request_new', authorized, placesController.validatePlaceParams, placesController.addPlace);

router.post('/update', authorized, protectedRoute, placesController.validatePlaceParams, placesController.updatePlace);

export default router;
