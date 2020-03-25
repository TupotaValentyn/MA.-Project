/**
 * @swagger
 *
 * definitions:
 *   UserPublicData:
 *     description: Публичные данные о пользователе, которые передаются на фронт после авторизации
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       email:
 *         type: string
 *         format: email
 *       isAdmin:
 *         type: boolean
 *       isConfirmed:
 *         type: boolean
 *       authType:
 *         type: string
 *         enum: [local, google, facebook]
 *         description: Способ авторизации пользователя (локальный, гугл или фейсбук)
 *
 */
export interface UserPublicData {
    id: number,
    email: string,
    isAdmin: boolean,
    isConfirmed: boolean,
    authType: 'local' | 'google' | 'facebook',
}

/**
 * @swagger
 *
 * definitions:
 *   TokenData:
 *     description: Данные о токене авторизации, которые передаются на фронт после авторизации
 *     type: object
 *     properties:
 *       expires:
 *         type: number
 *         format: timestamp
 *         description: "Дата завершения срока действия текущего токена в формате timestamp.
 *         Позволяет фронту проверять при навигации на защищенные роуты, не истек ли еще срок годности
 *         у текущего токена. Если истек - перенаправить пользователя на страницу авторизации"
 *       token:
 *         type: string
 *         description: "Сам токен, который нужно передавать в заголовках при запросах на защищенные
 *         пути. Заголовок должен иметь вид: ```authorization: Bearer TOKEN```"
 *
 */
export interface TokenData {
    expires: number,
    token: string,
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPublicData,
        }
    }
}
