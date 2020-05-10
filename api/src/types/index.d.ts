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
 *   WorkingPeriod:
 *     description: "Модель для описания графика работы заведения за 1 день."
 *     type: object
 *     properties:
 *       dayOfWeekOpen:
 *         type: number
 *         description: Номер дня недели, когда заведение открылось (0 - воскресенье, 6 - суббота)
 *       dayOfWeekClose:
 *         type: number
 *         description: Номер дня недели, когда заведение закроется (0 - воскресенье, 6 - суббота)
 *       openTime:
 *         type: string
 *         description: Время, когда заведение открылось (00:00 - 23:59)
 *       closeTime:
 *         type: string
 *         description: Время, когда заведение закроется (00:00 - 23:59)
 *       worksAllDay:
 *         type: boolean
 *         description: true, если заведение работает круглосуточно в этот день
 *       doesNotWorkToday:
 *         type: boolean
 *         description: true, если в заведении выходной в этот день
 */
export interface WorkingPeriod {
    openTime: string;
    closeTime: string;
    dayOfWeekOpen: number;
    dayOfWeekClose: number;
    worksAllDay: boolean;
    doesNotWorkToday: boolean;
}

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
 *       workingPeriod:
 *         type: WorkingPeriod?
 *         description: "Описание графика работы заведения на текущий день (смену).
 *         Поля не будет, если нет данных о графике работы заведения"
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
    workingPeriod?: WorkingPeriod;
    categories?: RestPlaceCategoryModel[];
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPublicData,
            locale?: 'ru' | 'ua',
        }
    }
}

export interface DefaultStaticModel {
    id: number;
    nameTextId: string;
}

export interface RestDurationStaticModel extends DefaultStaticModel {}
export interface RestCostStaticModel extends DefaultStaticModel {}
export interface CompanySizeStaticModel extends DefaultStaticModel {}
export interface CategoryStaticModel extends DefaultStaticModel {
    googleId: string;
    defaultRestDuration: number;
    defaultCompanySize: number;
    defaultRestCost: number;
    isActiveRest: boolean;
}
