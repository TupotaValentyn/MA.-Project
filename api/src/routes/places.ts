import express from 'express';

import { Op } from 'sequelize';
import { RestPlaceModel } from 'index';
import { BadRequest } from '@curveball/http-errors';
import { authorized, protectedRoute } from '../interceptors';

import {
    translateText, isPointInsideCircle, isWorkingNow, getWorkingPeriodForCurrentDay, formatNumber,
} from '../util';

import {
    Category, RestPlace, WorkingPeriod,
} from '../models';

import {
    Categories, RestDurations, RestCosts, CompanySizes, RestTypes, PlaceConfirmedStatuses,
} from '../staticModels';
import config from '../config';

const router = express.Router();

/**
 * @swagger
 * /places:
 *    get:
 *      tags:
 *        - Places
 *      summary: "Позволяет получить список мест, которые подходят под значения переданных фильтров"
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: "query"
 *          name: "categories"
 *          description: "Список id категорий из которых нужно осуществлять поиск заведений. Валидные значения - [1-15].
 *          Если не передано или не передано хотя бы 1 валидного значения - производится выборка из всех категорий"
 *          schema:
 *            type: number[]
 *        - in: "query"
 *          name: "restCost"
 *          description: "Значение фильтра стоимости отдыха. Валидные значения - [1-5]. Если не передано или передано
 *          невалидное значение - производится выборка по всем стоимостям"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "restDuration"
 *          description: "Значение фильтра длительности отдыха. Валидные значения - [1-3]. Если не передано или передано
 *          невалидное значение - производится выборка по всем длительностям"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "companySize"
 *          description: "Значение фильтра размера компании для отдыха в этом заведении. Валидные значения - [1-4].
 *          Если не передано или передано невалидное значение - производится выборка по всем размерам"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "restType"
 *          description: "Значение фильтра типа отдыха в заведении. Валидные значения - [1 (активный) - 2 (пассивный)].
 *          Если не передано или передано невалидное значение - производится выборка по всем типам"
 *          schema:
 *            type: number
 *        - in: "query"
 *          name: "workingOnly"
 *          description: "Если передать строку '1', в выборку попадут только те места, которые сейчас работают"
 *          schema:
 *            type: string
 *        - in: "query"
 *          name: "distance"
 *          description: "Значение фильтра максимального расстояния до заведения. Валидные значения - [0.5-15].
 *          Также необходимо передать текущие гео-координаты пользователя (поля userLatitude, userLongitude).
 *          Они будут служить центром круга зоны поиска, а значение distance будет радиусом этого круга"
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: "Список заведений успешно получен. В ответ клиент получит список мест, которые подходят
 *          под переданные фильтры. Ответ имеет вид ```{ places: RestPlaceModel[] }```"
 *      security:
 *        - default: []
 *
 */
router.get('/', authorized, async (request: express.Request, response: express.Response) => {
    const {
        categories, restCost, restDuration, companySize, restType, distance, userLatitude, userLongitude, workingOnly, confirmed
    } = request.query;

    const where: any = {};

    if (categories) {
        const selectedCategories: number[] = typeof categories === 'string' ? [Number(categories)] : categories.map(Number);
        const validCategories = selectedCategories.filter((category: number) => Categories.isValid(category));

        if (validCategories.length) {
            where['$categories.id$'] = {
                [Op.in]: validCategories,
            };
        }
    }

    if (RestCosts.isValid(restCost)) {
        where.restCost = restCost;
    }

    if (RestDurations.isValid(restDuration)) {
        where.restDuration = restDuration;
    }

    if (CompanySizes.isValid(companySize)) {
        where.companySize = companySize;
    }

    if (Number(restType) === RestTypes.Active) {
        where.isActiveRest = true;
    }

    if (PlaceConfirmedStatuses.isValid(Number(confirmed))) {
        where.confirmed = confirmed === '1';
    }

    let places = await RestPlace.findAll({
        where,
        include: [{
            model: Category,
            attributes: ['id', 'nameTextId'],
        }, WorkingPeriod],
    });

    if (distance && distance >= 0.5 && distance <= 15 && userLatitude && userLongitude) {
        places = places.filter((place) => isPointInsideCircle(
            { lat: userLatitude, lng: userLongitude },
            distance,
            { lat: place.latitude, lng: place.longitude },
        ));
    }

    if (workingOnly && Number(workingOnly) === 1) {
        places = places.filter(isWorkingNow);
    }

    const models: RestPlaceModel[] = places.map((place) => {
        const model: RestPlaceModel = {
            id: place.id,
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            googleMeanRating: place.googleMeanRating,
            googleReviewsCount: place.googleReviewsCount,
            meanRating: place.meanRating,
            reviewsCount: place.reviewsCount,
            isActiveRest: place.isActiveRest,
        };

        const placeRestDuration = RestDurations.findById(place.restDuration);

        model.restDuration = {
            id: placeRestDuration.id,
            name: translateText(placeRestDuration.nameTextId, request.locale),
        };

        const placeRestCost = RestCosts.findById(place.restCost);

        model.restCost = {
            id: placeRestCost.id,
            name: translateText(placeRestCost.nameTextId, request.locale),
        };

        const placeCompanySize = CompanySizes.findById(place.companySize);

        model.companySize = {
            id: placeCompanySize.id,
            name: translateText(placeCompanySize.nameTextId, request.locale),
        };

        const workingPeriod = getWorkingPeriodForCurrentDay(place.workingPeriods);

        if (workingPeriod) {
            model.workingPeriod = {
                closeTime: '',
                openTime: '',
                openTimeNumeric: workingPeriod.startTime,
                closeTimeNumeric: workingPeriod.endTime,
                dayOfWeekOpen: workingPeriod.dayOfWeekStart,
                dayOfWeekClose: workingPeriod.dayOfWeekEnd,
                worksAllDay: false,
                doesNotWorkToday: false
            };

            if (workingPeriod.startTime !== undefined) {
                const hours = Math.floor(workingPeriod.startTime / 100);
                const minutes = workingPeriod.startTime % 100;

                model.workingPeriod.openTime = `${formatNumber(hours)}:${formatNumber(minutes)}`;
            }

            if (workingPeriod.endTime !== undefined) {
                const hours = Math.floor(workingPeriod.endTime / 100);
                const minutes = workingPeriod.endTime % 100;

                model.workingPeriod.closeTime = `${formatNumber(hours)}:${formatNumber(minutes)}`;
            }

            if (workingPeriod.dayOfWeekStart === workingPeriod.dayOfWeekEnd
                && workingPeriod.startTime === 0
                && workingPeriod.endTime === 2359
            ) {
                model.workingPeriod.worksAllDay = true;
            }

            if (workingPeriod.dayOfWeekStart === workingPeriod.dayOfWeekEnd
                && workingPeriod.startTime === 0
                && workingPeriod.endTime === 0
            ) {
                model.workingPeriod.doesNotWorkToday = true;
            }
        }

        model.categories = place.categories.map((category) => ({
            id: category.id,
            name: translateText(category.nameTextId, request.locale),
        }));

        return model;
    });

    console.log(places.length);

    response.json({
        places: models,
    });
});

router.post('/delete', authorized, protectedRoute, async (request: express.Request, response: express.Response) => {
    const { ids } = request.body;

    if (!ids) {
        throw new BadRequest(translateText('errors.wrongPlaceId', request.locale));
    }

    const removedPlacesCount = await RestPlace.destroy({
        where: {
            id: {
                [Op.in]: Array.isArray(ids) ? ids : [ids],
            }
        },
    });

    response.json({
        removed: removedPlacesCount > 0,
    });
});

const validatePlaceParams = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const {
        name, latitude, longitude, restDuration, restCost, companySize, restType, categoryIds,
    } = request.body;

    if (!(name && name.toString().length >= 3)) {
        throw new BadRequest(translateText('errors.wrongPlaceName', request.locale));
    }

    if (!(latitude && typeof latitude === 'number')) {
        throw new BadRequest(translateText('errors.wrongPlaceGeoLocation', request.locale));
    }

    if (!(longitude && typeof longitude === 'number')) {
        throw new BadRequest(translateText('errors.wrongPlaceGeoLocation', request.locale));
    }

    const isPlaceInCherkasy = isPointInsideCircle(config.CHERKASY_CENTER, config.CHERKASY_BOUNDS_RADIUS, {
        lat: latitude,
        lng: longitude,
    });

    if (!isPlaceInCherkasy) {
        throw new BadRequest(translateText('errors.placeIsNotInCherkasy', request.locale));
    }

    if (!(restDuration && RestDurations.isValid(Number(restDuration)))) {
        throw new BadRequest(translateText('errors.wrongPlaceRestDuration', request.locale));
    }

    if (!(restCost && RestCosts.isValid(Number(restCost)))) {
        throw new BadRequest(translateText('errors.wrongPlaceRestCost', request.locale));
    }

    if (!(companySize && CompanySizes.isValid(Number(companySize)))) {
        throw new BadRequest(translateText('errors.wrongPlaceCompanySize', request.locale));
    }

    if (!(restType && RestTypes.isValid(Number(restType)))) {
        throw new BadRequest(translateText('errors.wrongPlaceRestType', request.locale));
    }

    if (!(categoryIds && categoryIds.length)) {
        throw new BadRequest(translateText('errors.wrongPlaceCategories', request.locale));
    }

    const areCategoriesValid = categoryIds.every((categoryId: any) => Categories.isValid(Number(categoryId)));

    if (!areCategoriesValid) {
        throw new BadRequest(translateText('errors.wrongPlaceCategories', request.locale));
    }

    next();
};

router.post('/request_new', authorized, validatePlaceParams, async (request: express.Request, response: express.Response) => {
    const {
        name, latitude, longitude, restDuration, restCost, companySize, restType, categoryIds,
    } = request.body;

    const placeModel = {
        name,
        latitude,
        longitude,
        restDuration,
        restCost,
        companySize,
        isActiveRest: restType === RestTypes.Active,
        confirmed: false,
    };

    const categories = await Category.findAll({
        where: {
            id: { [Op.in]: categoryIds },
        },
    });

    const place = await RestPlace.create(placeModel);
    await place.$set('categories', categories);

    response.json({ created: true });
});

router.post('/update', authorized, protectedRoute, validatePlaceParams, async (request: express.Request, response: express.Response) => {
    const {
        name, latitude, longitude, restDuration, restCost, companySize, restType, categoryIds, id
    } = request.body;

    if (!id) {
        throw new BadRequest(translateText('errors.wrongPlaceId', request.locale));
    }

    const place = await RestPlace.findOne({ where: { id } });

    if (!place) {
        throw new BadRequest(translateText('errors.placeNotFound', request.locale));
    }

    const placeModel = {
        name,
        latitude,
        longitude,
        restDuration,
        restCost,
        companySize,
        isActiveRest: restType === RestTypes.Active,
    };

    const categories = await Category.findAll({
        where: {
            id: { [Op.in]: categoryIds },
        },
    });

    await place.update(placeModel);
    await place.$set('categories', categories);

    response.json({ updated: true });
});

export default router;
