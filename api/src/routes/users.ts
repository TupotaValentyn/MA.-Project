import express from 'express';

import { BadRequest } from '@curveball/http-errors';
import { UserPublicData } from 'index';
import { verify } from 'jsonwebtoken';
import { authorized } from '../interceptors';
import { translateText } from '../util';
import { User } from '../models';
import config from '../config';
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

router.post('/reset_password', usersController.resetPassword);

router.post('/update_password', usersController.updatePassword);

export default router;
