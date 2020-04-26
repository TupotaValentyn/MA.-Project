import express from 'express';

import { Op } from 'sequelize';
import { RestPlaceModel } from 'index';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js/dist/common';
import { translateText } from '../util';

import {
    Category, CompanySize, Cost, Duration, RestPlace,
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

    function arePointsNear(checkPoint: LatLngLiteral, centerPoint: LatLngLiteral, km: number) {
        const ky = 40000 / 360;
        // eslint-disable-next-line no-mixed-operators
        const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }

    if (distance && distance >= 1 && distance <= 20 && userLatitude && userLongitude) {
        // (x-x0)^2+(y-y0)^2 < = R^2
        where[Op.and] = {
            // [Sequelize.literal('2 + 2')]: {
            //     [Op.lte]: 4
            // }
        };
    }

    const places = await RestPlace.findAll({
        where,
        include: [{
            model: Category,
            attributes: ['id', 'nameTextId'],
        }, Duration, Cost, CompanySize],
    });

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