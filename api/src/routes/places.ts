import express from 'express';

import { authorized, protectedRoute } from '../interceptors';

import { placesController } from '../controllers';

const router = express.Router();

/**
 * @swagger
 * /places:
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
 *          description: "Значение фильтра типа отдыха в заведении: true (активный отдых) - false (пассивный)].
 *          Если не передано или передано невалидное значение - производится выборка по всем типам"
 *          schema:
 *            type: boolean
 *        - in: "query"
 *          name: "workingOnly"
 *          description: "Если передать true, в выборку попадут только те места, которые сейчас работают"
 *          schema:
 *            type: boolean
 *        - in: "query"
 *          name: "ignoreStatus"
 *          description: "Если передать true, в выборку попадут все места, а не только подтвержденные"
 *          schema:
 *            type: boolean
 *        - in: "query"
 *          name: "distance"
 *          description: "Значение фильтра максимального расстояния до заведения. Валидные значения - [0.5-6].
 *          Также необходимо передать текущие гео-координаты пользователя (поля userLatitude, userLongitude).
 *          Они будут служить центром круга зоны поиска, а значение distance будет радиусом этого круга"
 *          schema:
 *            type: number
 *      responses:
 *        '200':
 *          description: "Список заведений успешно получен. В ответ клиент получит список мест, которые подходят
 *          под переданные фильтры. Ответ имеет вид ```{ places: RestPlaceModel[] }```"
 *      security:
 *        - default: []
 *
 */
router.get('/', authorized, placesController.getPlacesByFilters);

/**
 * @swagger
 * /places/delete:
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

/**
 * @swagger
 * /places/add:
 *    post:
 *      tags:
 *        - Places
 *      summary: "Позволяет пользователю подать заявку на добавление нового заведения в БД. Новое заведение будет иметь
 *      статус неподтвержденного, пока заявка не будет одобрена администраторами в панели управления. Неподтвержденные места
 *      не попадают в выборки заведений"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "name"
 *          description: "Название заведения. Не меньше 3-х символов"
 *          schema:
 *            type: string
 *        - in: "body"
 *          name: "latitude"
 *          description: "Значение широты гео-координат заведения"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "longitude"
 *          description: "Значение долготы гео-координат заведения"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "restDuration"
 *          description: "ID выбранной длительности отдыха. Валидные значения - [1-3]"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "restCost"
 *          description: "ID выбранной стоимости отдыха. Валидные значения - [1-5]"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "companySize"
 *          description: "ID выбранного размера компании. Валидные значения - [1-4]"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "restType"
 *          description: "Тип отдыха. 1 - активный отдых, 2 - пассивный"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "categoryIds"
 *          description: "Список ID категорий, в которые входит заведение. Валидные значения - [1-15]"
 *          schema:
 *            type: number[]
 *        - in: "body"
 *          name: "periods"
 *          description: "Данные о графике работы заведения. Массив из 7 объектов, каждый из которых описывает
 *          график работы заведения в конкретный день недели. Каждый объект должен иметь вид: <br><code>{
 *                \n dayStart: number, // номер дня недели, когда смена начинается; 0 - воскресенье, 6 - суббота. Обязательное поле
 *                \n dayOff: boolean, // true, если в заведении выходной
 *                \n worksAllDay: boolean, // true, если в заведение работает круглосуточно
 *                \n dayEnd: number, // номер дня недели, когда смена заканчивается; 0 - воскресенье, 6 - суббота.
 *                \n timeStart: number, // время начала смены в формате числа [0-2359]
 *                \n dayStart: number, // время окончания смены в формате числа [0-2359]
 *            \n }</code>.<br>День окончания смены и время работы не обязательные, если передать
 *            ```dayOff: true``` или ```worksAllDay: true``` и наоборот"
 *          schema:
 *            type: object[]
 *      responses:
 *        '200':
 *          description: "Статус операции: true если заведение было добавлено. Ответ имеет вид ```{ created: boolean }```"
 *        '400':
 *          description: "Неправильный запрос: переданы неправильные данные"
 *      security:
 *        - default: []
 *
 */
router.post('/add', authorized, placesController.validatePlaceParams, placesController.addPlace);

/**
 * @swagger
 * /places/update:
 *    post:
 *      tags:
 *        - Places
 *      summary: "Позволяет администратору обновить данные об заведении"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "id"
 *          description: "ID заведения"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "name"
 *          description: "Название заведения. Не меньше 3-х символов"
 *          schema:
 *            type: string
 *        - in: "body"
 *          name: "latitude"
 *          description: "Значение широты гео-координат заведения"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "longitude"
 *          description: "Значение долготы гео-координат заведения"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "restDuration"
 *          description: "ID выбранной длительности отдыха. Валидные значения - [1-3]"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "restCost"
 *          description: "ID выбранной стоимости отдыха. Валидные значения - [1-5]"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "companySize"
 *          description: "ID выбранного размера компании. Валидные значения - [1-4]"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "restType"
 *          description: "Тип отдыха. 1 - активный отдых, 2 - пассивный"
 *          schema:
 *            type: number
 *        - in: "body"
 *          name: "categoryIds"
 *          description: "Список ID категорий, в которые входит заведения. Валидные значения - [1-15]"
 *          schema:
 *            type: number[]
 *        - in: "body"
 *          name: "periods"
 *          description: "Данные о графике работы заведения. Массив из 7 объектов, каждый из которых описывает
 *          график работы заведения в конкретный день недели. Каждый объект должен иметь вид: <br><code>{
 *                \n dayStart: number, // номер дня недели, когда смена начинается; 0 - воскресенье, 6 - суббота. Обязательное поле
 *                \n dayOff: boolean, // true, если в заведении выходной
 *                \n worksAllDay: boolean, // true, если в заведение работает круглосуточно
 *                \n dayEnd: number, // номер дня недели, когда смена заканчивается; 0 - воскресенье, 6 - суббота.
 *                \n timeStart: number, // время начала смены в формате числа [0-2359]
 *                \n dayStart: number, // время окончания смены в формате числа [0-2359]
 *            \n }</code>.<br>День окончания смены и время работы не обязательные, если передать
 *            ```dayOff: true``` или ```worksAllDay: true``` и наоборот"
 *          schema:
 *            type: object[]
 *      responses:
 *        '200':
 *          description: "Статус операции: true если данные были обновлены. Ответ имеет вид ```{ updated: boolean }```"
 *        '400':
 *          description: "Неправильный запрос: переданы неправильные данные"
 *      security:
 *        - default: []
 *
 */
router.post('/update', authorized, protectedRoute, placesController.validatePlaceParams, placesController.updatePlace);

/**
 * @swagger
 * /places/confirm:
 *    post:
 *      tags:
 *        - Places
 *      summary: "Позволяет администратору изменить статус заведения с неподтвержденного на подтвержденный"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "id"
 *          description: "ID заведения"
 *          schema:
 *            type: number
 *      responses:
 *        '200':
 *          description: "Статус операции: true если данные были обновлены. Ответ имеет вид ```{ updated: true }```"
 *        '400':
 *          description: "Неправильный запрос: не передан ID заведения или нет заведения с таким ID"
 *      security:
 *        - default: []
 *
 */
router.post('/confirm', authorized, protectedRoute, placesController.confirmPlace);

export default router;
