import express from 'express';

import { authController } from '../controllers';

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
router.post('/local', authController.signInUsingPassword);

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
router.post('/register', authController.register);

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
router.get('/check_verification/:userHash', authController.checkAccountVerification);

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
router.post('/resend_confirmation/:userHash', authController.resendConfirmationEmail);

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
router.post('/google', authController.signInUsingGoogle);

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
router.post('/facebook', authController.signInUsingFacebook);

router.get('/verify_email/:userHash', authController.verifyEmail);

export default router;
