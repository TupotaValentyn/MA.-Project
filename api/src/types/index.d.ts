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

interface DefaultModel {
    id: number;
    name: string;
}

/**
 * @swagger
 *
 * definitions:
 *   RestPlaceCategoryModel:
 *     description: Модель для описания категории мест отдыха
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 */
export interface RestPlaceCategoryModel extends DefaultModel {}

/**
 * @swagger
 *
 * definitions:
 *   RestDurationModel:
 *     description: Модель для описания длительности отдыха некоторого места
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 */
export interface RestDurationModel extends DefaultModel {}

/**
 * @swagger
 *
 * definitions:
 *   RestCostModel:
 *     description: Модель для описания стоимости отдыха некоторого места
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 */
export interface RestCostModel extends DefaultModel {}

/**
 * @swagger
 *
 * definitions:
 *   CompanySizeModel:
 *     description: Модель для описания размера компании некоторого места отдыха
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 */
export interface CompanySizeModel extends DefaultModel {}

/**
 * @swagger
 *
 * definitions:
 *   RestPlaceModel:
 *     description: Модель для описания некоторого места отдыха
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *         description: Название места согласно данным Google
 *       latitude:
 *         type: number
 *         description: Координата места (широта)
 *       longitude:
 *         type: number
 *         description: Координата места (долгота)
 *       googleMeanRating:
 *         type: number
 *         description: Рейтинг заведения согласно данным Google
 *       googleReviewsCount:
 *         type: number
 *         description: Количество отзывов заведения согласно данным Google
 *       meanRating:
 *         type: number
 *         description: Рейтинг заведения согласно данным нашей системы
 *       reviewsCount:
 *         type: number
 *         description: Количество отзывов заведения согласно данным нашей системы
 *       isActiveRest:
 *         type: boolean
 *         description: Флажок типа отдыха заведения (true - активный, false - пассивный)
 *       restDuration:
 *         type: RestDurationModel
 *         description: Описание продолжительности отдыха в заведении
 *       restCost:
 *         type: RestCostModel
 *         description: Описание стоимости отдыха в заведении
 *       companySize:
 *         type: CompanySizeModel
 *         description: Описание размера компании, стандартного для отдыха в заведении
 *       categories:
 *         type: RestPlaceCategoryModel[]
 *         description: Описание категорий, в которые входит заведение
 */
export interface RestPlaceModel {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    googleMeanRating: number;
    googleReviewsCount: number;
    meanRating: number;
    reviewsCount: number;
    isActiveRest: boolean;
    restDuration?: RestDurationModel;
    restCost?: RestCostModel;
    companySize?: CompanySizeModel;
    categories?: RestPlaceCategoryModel[];
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPublicData,
        }
    }
}
