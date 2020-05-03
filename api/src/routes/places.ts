import express from 'express';

import { Op } from 'sequelize';
import { RestPlaceModel } from 'index';

import {
    translateText, isPointInsideCircle, isWorkingNow, getWorkingPeriodForCurrentDay, formatNumber
} from '../util';

import {
    Category, CompanySize, Cost, Duration, RestPlace, WorkingPeriod,
} from '../models';

import {
    CompanySizeMapping, RestCostMapping, RestDurationMapping, RestPlaceCategoryMapping, RestTypesMapping,
} from '../models/mappings';

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
 *
 */
router.get('/', async (request, response) => {
    const {
        categories, restCost, restDuration, companySize, restType, distance, userLatitude, userLongitude, workingOnly
    } = request.query;

    const where: any = {};

    if (categories) {
        const selectedCategories: number[] = typeof categories === 'string' ? [Number(categories)] : categories.map(Number);
        const validCategories = selectedCategories.filter((category: number) => category in RestPlaceCategoryMapping);

        if (validCategories.length) {
            where['$Categories.id$'] = {
                [Op.in]: validCategories,
            };
        }
    }

    if (restCost in RestCostMapping) {
        where.restCost = restCost;
    }

    if (restDuration in RestDurationMapping) {
        where.restDuration = restDuration;
    }

    if (companySize in CompanySizeMapping) {
        where.companySize = companySize;
    }

    if (restType in RestTypesMapping) {
        where.isActiveRest = Number(restType) === RestTypesMapping.Active;
    }

    let places = await RestPlace.findAll({
        where,
        include: [{
            model: Category,
            attributes: ['id', 'nameTextId'],
        }, Duration, Cost, CompanySize, WorkingPeriod],
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

        model.restDuration = {
            id: place.restDuration.id,
            name: translateText(place.restDuration.nameTextId),
        };

        model.restCost = {
            id: place.restCost.id,
            name: translateText(place.restCost.nameTextId),
        };

        model.companySize = {
            id: place.companySize.id,
            name: translateText(place.companySize.nameTextId),
        };

        const workingPeriod = getWorkingPeriodForCurrentDay(place.workingPeriods);

        if (workingPeriod) {
            model.workingPeriod = {
                closeTime: '',
                openTime: '',
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
            name: translateText(category.nameTextId),
        }));

        return model;
    });

    console.log(places.length);

    response.json({
        places: models,
    });
});

export default router;
