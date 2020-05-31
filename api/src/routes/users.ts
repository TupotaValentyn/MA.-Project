import express from 'express';

import { authorized } from '../interceptors';
import { usersController } from '../controllers';


const router = express.Router();

/**
 * @swagger
 * /user/{token}:
 *    get:
 *      tags:
 *        - User
 *      summary: "Позволяет получить данные о пользователе по токену авторизации"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "path"
 *          name: "token"
 *          required: true
 *          schema:
 *            type: string
 *            description: "Token, который получен после авторизации пользователя"
 *      responses:
 *        '200':
 *          description: "Данные о пользователе успешно получены. Возвращает данные о пользователе вида ```{ userData: UserPublicData }```."
 *        '400':
 *          description: Неправильный запрос. Некорректный/несуществующий token авторизации.
 *
 */
router.get('/:token', usersController.getUserByToken);

/**
 * @swagger
 * /user/change_locale:
 *    post:
 *      tags:
 *        - User
 *      summary: "Позволяет пользователю сменить язык"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "locale"
 *          required: true
 *          schema:
 *            type: string
 *            description: "Новый язык пользователя. Валидные значения - ('ru' | 'ua')"
 *      responses:
 *        '200':
 *          description: "Язык успешно изменен. Возвращает данные об установленном языке вида ```{ newLocale: string }```."
 *      security:
 *        - default: []
 *
 */
router.post('/change_locale', authorized, usersController.changeLocale);

/**
 * @swagger
 * /user/reset_password:
 *    post:
 *      tags:
 *        - User
 *      summary: "Позволяет пользователю сменить пароль аккаунта"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "email"
 *          required: true
 *          description: "Почта пользователя. На нее будет отправлена ссылка для сброса пароля"
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: "Письмо успешно отправлено. Возвращает ответ вида ```{ sent: boolean }```."
 *        '400':
 *          description: Неправильный запрос. Не передан email или пользователя с таким email не существует.
 *
 */
router.post('/reset_password', usersController.resetPassword);

/**
 * @swagger
 * /user/update_password:
 *    post:
 *      tags:
 *        - User
 *      summary: "Позволяет пользователю заменить пароль аккаунта"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "userHash"
 *          required: true
 *          description: "Хеш пользователя. Нужно взять из URL страницы ввода нового пароля"
 *          schema:
 *            type: string
 *        - in: "body"
 *          name: "password"
 *          required: true
 *          description: "Новый пароль аккаунта (мин. 8 символов)"
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: "Пароль успешно изменен. Возвращает ответ вида ```{ updated: boolean }```."
 *        '400':
 *          description: Неправильный запрос. Не переданы параметры, некорректный пароль или пользователя с таким userHash не существует.
 *
 */
router.post('/update_password', usersController.updatePassword);

export default router;
