import express from 'express';

import { Op } from 'sequelize';
import { RestPlaceCategoryModel, RestPlaceModel } from 'index';
import { translateText } from '../util';

import {
    Category, CompanySize, Cost, Duration, RestPlace, RestPlaceCategory,
} from '../models';

import {
    CompanySizeMapping, RestCostMapping, RestDurationMapping, RestPlaceCategoryMapping
} from '../models/mappings';

const router = express.Router();

/**
 * @swagger
 * /places:
 *    get:
 *      tags:
 *        - Places
 *      summary: "Позволяет получить данные о статичных фильтрах: категориях, длительностях отдыха, стоимостях отдыха и размерах компании"
 *      responses:
 *        '200':
 *          description: "Данные фильтров успешно получены."
 *
 */
router.get('/', async (request, response) => {
    const {
        categories, restCost, restDuration, companySize, restType
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

    // 1 - active rest
    // 2 - passive rest
    if (['1', '2'].includes(restType)) {
        where.isActiveRest = restType === '1';
    }

    console.log(where);

    const places = await RestPlace.findAll({
        where,
        include: [{
            model: Category,
            attributes: ['id', 'nameTextId'],
        }, Duration, Cost, CompanySize],
    });

    console.log(places[0]);

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
