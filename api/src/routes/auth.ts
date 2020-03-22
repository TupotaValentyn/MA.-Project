import express from 'express';
import bcrypt from 'bcrypt';
import nodeMailer from 'nodemailer';
import { BadRequest } from "@curveball/http-errors";

import {TokenData, UserPublicData} from "index";

import config from "../config";

import { ApiInformation } from 'swagger-jsdoc';

import { translate, isValidEmail, generateTokenData, createMailTransporter, generateUserHash } from '../util';

import { User } from '../models';

const router = express.Router();

router.post('/local', async (request, response) => {
    const user = await User.create({
        id: null,
        email: 123
    });

    await user.save();

    response.json({ method: 'local' });
});

/**
 * @swagger
 * /auth/register:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Регистрирует нового пользователя в системе.
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
 *          description: "Пользователь успешно зарегистрирован в системе. <br>Возвращает публичные данные о пользователе и данные о токене вида ```{ userData: UserPublicData, tokenData: TokenData }```. См. описание этих типов в моделях"
 *        '400':
 *          description: Неправильный запрос. Некорректный email/пароль, пользователь с таким email уже зарегистрирован в системе.
 *        '500':
 *          description: Разные ошибки сервера
 *
 */
router.post('/register', async (request: express.Request, response: express.Response) => {
    let { email, password } = request.body;

    if (email) {
        email = email.trim();
    }

    if (password) {
        password = password.toString().trim();
    }

    if (!(email && isValidEmail(email))) {
        throw new BadRequest(translate(0, 'Некорректный email'));
    }

    if (!(password && password.length >= 8)) {
        throw new BadRequest(translate(0, 'Некорректный пароль'));
    }

    const usersWithSameMail = await User.findAll({ where: { email } });

    if (usersWithSameMail.length) {
        throw new BadRequest(translate(0, 'Пользователь с такой почтой уже зарегистрирован в системе'));
    }

    const salt = await bcrypt.genSalt(3);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userHash = generateUserHash(email);

    await User.create({
        email,
        userHash,
        password: encryptedPassword,
        isConfirmed: false,
    });

    const transporter = createMailTransporter();

    const mailOptions = {
        from: `"Rest Finder" <${config.MAIL_USER}>`,
        to: email,
        subject: translate(0, 'Регистрация в системе'),
        html: `
            <h3>Вы успешно зарегистрировались в системе!</h3>
            <a href="http://localhost:3000/auth/verify_email/${userHash}">
                Подтвердить почту
            </a>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);

        response.json({ userHash });
    });

    // const userPublicData: UserPublicData = {
    //     id: user.id,
    //     email: user.email,
    //     isConfirmed: user.isConfirmed,
    //     isAdmin: user.isAdmin,
    //     authType: 'local',
    // };
    //
    // const tokenData: TokenData = generateTokenData(userPublicData);
    //
    // response.json({
    //     tokenData,
    //     userData: userPublicData,
    // });
});

router.get('/verify_email/:userHash', async (request, response) => {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash }
    });

    if (!userByHash) {
        return response.send(translate(0, 'Неправильный хеш'));
    }

    if (userByHash.isConfirmed) {
        return response.send(translate(0, 'Почта уже подтверждена'));
    }

    await User.update({ isConfirmed: true }, { where: { userHash } });

    response.send(translate(0, 'Спасибо, Ваша почта подтверждена! Вернитесь на сайт и нажмите кнопку "Проверить подтверждение"'));
});

router.post('/google', (request, response) => {
    response.json({ method: 'google' });
});

router.post('/facebook', (request, response) => {
    response.json({ method: 'facebook' });
});

export default router;
