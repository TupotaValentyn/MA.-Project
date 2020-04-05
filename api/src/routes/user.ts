import express from 'express';

import { BadRequest } from '@curveball/http-errors';
import { UserPublicData } from 'index';
import { verify } from 'jsonwebtoken';
import { translate } from '../util';

const router = express.Router();

/**
 * @swagger
 * /user/{token}:
 *    post:
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
        throw new BadRequest(translate(0, 'Неправильный token'));
    }

    try {
        const userData = await verify(token, process.env.JWT_SECRET) as UserPublicData;
        response.json({ userData });
    } catch (error) {
        throw new BadRequest(translate(0, 'Неправильный token'));
    }
});

export default router;
