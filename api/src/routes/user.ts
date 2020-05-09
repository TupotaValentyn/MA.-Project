import express from 'express';

import { BadRequest } from '@curveball/http-errors';
import { UserPublicData } from 'index';
import { verify } from 'jsonwebtoken';
import { authorized } from '../interceptors';
import { translateText } from '../util';
import { User } from '../models';
import config from '../config';


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
router.get('/:token', async (request, response) => {
    const { token } = request.params;

    if (!token) {
        throw new BadRequest(translateText('errors.wrongAuthToken', request.locale));
    }

    try {
        const userData = await verify(token, process.env.JWT_SECRET) as UserPublicData;
        response.json({ userData });
    } catch (error) {
        throw new BadRequest(translateText('errors.wrongAuthToken', request.locale));
    }
});

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
router.post('/change_locale', authorized, async (request, response) => {
    const { locale } = request.body;
    const validatedLocale = config.AVAILABLE_LOCALES.includes(locale) ? locale : config.DEFAULT_LOCALE;

    const userModel = await User.findOne({ where: { id: request.user.id } });
    userModel.locale = validatedLocale;
    await userModel.save();

    response.json({ newLocale: validatedLocale });
});

export default router;
