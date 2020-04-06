import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';

import { Op } from 'sequelize';
import { OAuth2Client } from 'google-auth-library';
import { BadRequest } from '@curveball/http-errors';
import { TokenData, UserPublicData } from 'index';
import { User } from '../models';

import {
    generateTokenData, generateUserHash, isValidEmail, sendConfirmationEmail, getTemplateHTML, translateText
} from '../util';

const router = express.Router();

/**
 * @swagger
 * /auth/local:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Позволяет войти в систему с помощью почты и пароля
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *                example: 12345678
 *      responses:
 *        '200':
 *          description: "Пользователь успешно вошел на сайт.<br>Если пользователь подтвердил свою почту, возвращает
 *          данные о токене авторизации вида ```{ tokenData: TokenData }```.
 *          В этом случае необходимо сохранить эти данные на фронте и перенаправить пользователя в систему.
 *          <br>Если почта не подтверждена, в ответ фронт получит уникальный
 *          хеш пользователя (```{ userHash: string }```), который необходим для идентификации пользователя в дальнейших
 *          запросах (проверки подтверждения почты и повторной отправки письма для ее подтверждения)."
 *        '400':
 *          description: Неправильный запрос. Несуществующий email или неправильный пароль.
 *
 */
router.post('/local', async (request, response) => {
    const requestBody = { email: '', password: '', ...request.body };

    const email = requestBody.email.toString().trim();
    const password = requestBody.password.toString().trim();

    const userByEmail = await User.findOne({
        where: {
            email,
            password: {
                [Op.ne]: null,
            },
        },
    });

    if (!userByEmail) {
        throw new BadRequest(translateText('errors.noUserWithEmail'));
    }

    const isCorrectPassword = await bcrypt.compare(password, userByEmail.password);

    if (!isCorrectPassword) {
        throw new BadRequest(translateText('errors.wrongPassword'));
    }

    if (!userByEmail.isConfirmed) {
        return response.json({
            userHash: userByEmail.userHash,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByEmail.id,
        email: userByEmail.email,
        isConfirmed: userByEmail.isConfirmed,
        isAdmin: userByEmail.isAdmin,
        authType: 'local',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
});

/**
 * @swagger
 * /auth/register:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Регистрирует нового пользователя в системе с помощью почты и пароля.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *                example: 12345678
 *                description: Должен быть 8+ символов
 *      responses:
 *        '200':
 *          description: "Пользователь успешно зарегистрирован в системе.
 *          <br>Возвращает уникальный хеш пользователя (```{ userHash: string }```),
 *          который необходим для идентификации пользователя в дальнейших запросах (проверки подтверждения почты
 *          и повторной отправки письма для ее подтверждения)."
 *        '400':
 *          description: Неправильный запрос. Некорректный email/пароль, пользователь с таким email уже зарегистрирован в системе.
 *
 */
router.post('/register', async (request: express.Request, response: express.Response) => {
    const requestBody = { email: '', password: '', ...request.body };

    const email = requestBody.email.toString().trim();
    const password = requestBody.password.toString().trim();

    if (!isValidEmail(email)) {
        throw new BadRequest(translateText('errors.wrongEmail'));
    }

    if (password.length < 8) {
        throw new BadRequest(translateText('errors.wrongPassword'));
    }

    const usersWithSameMail = await User.findAll({ where: { email } });

    if (usersWithSameMail.length) {
        throw new BadRequest(translateText('errors.notUniqueEmail'));
    }

    const salt = await bcrypt.genSalt(3);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userHash = generateUserHash(email);

    await User.create({
        email,
        userHash,
        password: encryptedPassword,
    });

    await sendConfirmationEmail(email, userHash);
    response.json({ userHash });
});

/**
 * @swagger
 * /auth/check_verification/{userHash}:
 *    get:
 *      tags:
 *        - Auth
 *      summary: Позволяет проверить, подтвердил ли пользователь почту или нет.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "path"
 *          name: "userHash"
 *          required: true
 *          schema:
 *            type: string
 *            example: 3f1beaef8cee09ce627d7a5b929a12fc5592fc5b19cebf6d44c732d0f1a13ec6
 *      responses:
 *        '200':
 *          description: "Если пользователь подтвердил свою почту, возвращает данные о токене
 *          авторизации вида ```{ tokenData: TokenData }```. В этом случае необходимо
 *          сохранить эти данные на фронте и перенаправить пользователя в систему.
 *          <br>Если почта не подтверждена, в ответ фронт получит ```{ isConfirmed: false }```"
 *        '400':
 *          description: Неправильный запрос. Некорректный/несуществующий хеш пользователя.
 *
 */
router.get('/check_verification/:userHash', async (request, response) => {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash },
    });

    if (!userByHash) {
        throw new BadRequest(translateText('errors.wrongHash'));
    }

    if (!userByHash.isConfirmed) {
        return response.json({
            isConfirmed: false,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByHash.id,
        email: userByHash.email,
        isConfirmed: userByHash.isConfirmed,
        isAdmin: userByHash.isAdmin,
        authType: 'local',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
});

/**
 * @swagger
 * /auth/resend_confirmation/{userHash}:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Позволяет повторно отправить письмо с ссылкой для подтверждения почты.
 *      description: "<b>Внимание!</b> Данная операция генерирует новый userHash для пользователя, старый становится недействительным!"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "path"
 *          name: "userHash"
 *          required: true
 *          schema:
 *            type: string
 *            example: 3f1beaef8cee09ce627d7a5b929a12fc5592fc5b19cebf6d44c732d0f1a13ec6
 *      responses:
 *        '200':
 *          description: "Письмо успешно отправлено. В ответ возвращается новый хеш пользователя (```{ userHash: string }```)"
 *        '400':
 *          description: Неправильный запрос. Некорректный/несуществующий хеш пользователя.
 *
 */
router.post('/resend_confirmation/:userHash', async (request, response) => {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash },
    });

    if (!userByHash) {
        throw new BadRequest(translateText('errors.wrongHash'));
    }

    const newUserHash = generateUserHash(userByHash.email);

    userByHash.userHash = newUserHash;
    await userByHash.save();

    await sendConfirmationEmail(userByHash.email, newUserHash);

    response.json({ userHash: newUserHash });
});

/**
 * @swagger
 * /auth/google:
 *    post:
 *      tags:
 *        - Auth
 *      summary: "Позволяет войти в систему с помощью аккаунта Google."
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *                description: id_token пользователя, который выдаст Google при авторизации
 *      responses:
 *        '200':
 *          description: "Пользователь успешно вошел на сайт. Если в базе аккаунта с таким userId нет, он будет создан.
 *          Если в базе уже есть пользователь с таким же email, как в профиле Google, аккаунт Google будет привязан к этому пользователю.
 *          Возвращает данные о токене авторизации вида ```{ tokenData: TokenData }```.
 *          Необходимо сохранить эти данные на фронте и перенаправить пользователя в систему."
 *        '400':
 *          description: Неправильный запрос. Не передан хеш пользователя.
 *
 */
router.post('/google', async (request, response) => {
    const { token } = request.body;

    if (!token) {
        throw new BadRequest(translateText('errors.wrongGoogleToken'));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
    });

    const { sub: userId, email } = ticket.getPayload();

    let userByEmail = await User.findOne({ where: { email } });

    if (userByEmail) {
        userByEmail.googleId = userId;
        userByEmail.isConfirmed = true;

        await userByEmail.save();
    } else {
        userByEmail = await User.create({
            email,
            googleId: userId,
            isConfirmed: true,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByEmail.id,
        email: userByEmail.email,
        isConfirmed: userByEmail.isConfirmed,
        isAdmin: userByEmail.isAdmin,
        authType: 'google',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
});

/**
 * @swagger
 * /auth/facebook:
 *    post:
 *      tags:
 *        - Auth
 *      summary: "Позволяет войти в систему с помощью аккаунта Facebook."
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "body"
 *          name: "body"
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              accessToken:
 *                type: string
 *                description: Временный accessToken пользователя, который выдаст Facebook при авторизации
 *              userId:
 *                type: string
 *                description: Id аккаунта Facebook пользователя
 *      responses:
 *        '200':
 *          description: "Пользователь успешно вошел на сайт. Если в базе аккаунта с таким userId нет, он будет создан.
 *          Если в базе уже есть пользователь с таким же email, как в профиле Facebook, аккаунт Facebook будет привязан к этому пользователю.
 *          Возвращает данные о токене авторизации вида ```{ tokenData: TokenData }```.
 *          Необходимо сохранить эти данные на фронте и перенаправить пользователя в систему."
 *        '400':
 *          description: Неправильный запрос. Некорректный/несуществующий хеш пользователя.
 *
 */
router.post('/facebook', async (request, response) => {
    const { accessToken, userId } = request.body;

    if (!accessToken) {
        throw new BadRequest(translateText('errors.wrongFacebookToken'));
    }

    if (!userId) {
        throw new BadRequest(translateText('errors.wrongFacebookUserId'));
    }

    const url = `https://graph.facebook.com/v2.6/${userId}?fields=email&access_token=${accessToken}`;

    const fbResponse = await axios.get(url);
    const { email, id } = fbResponse.data;

    let userByEmail = await User.findOne({ where: { email } });

    if (userByEmail) {
        userByEmail.facebookId = id;
        userByEmail.isConfirmed = true;

        await userByEmail.save();
    } else {
        userByEmail = await User.create({
            email,
            facebookId: id,
            isConfirmed: true,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByEmail.id,
        email: userByEmail.email,
        isConfirmed: userByEmail.isConfirmed,
        isAdmin: userByEmail.isAdmin,
        authType: 'facebook',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
});

router.get('/verify_email/:userHash', async (request, response) => {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash },
    });

    if (!userByHash) {
        const pageHTML = await getTemplateHTML('email_confirmed', {
            message: translateText('errors.wrongHash'),
        });

        return response.send(pageHTML);
    }

    if (userByHash.isConfirmed) {
        const pageHTML = await getTemplateHTML('email_confirmed', {
            message: translateText('errors.emailAlreadyConfirmed'),
        });

        return response.send(pageHTML);
    }

    await User.update({ isConfirmed: true, userHash: null }, { where: { userHash } });

    const pageHTML = await getTemplateHTML('email_confirmed', {
        message: translateText('emailConfirmed'),
    });

    response.send(pageHTML);
});

export default router;
