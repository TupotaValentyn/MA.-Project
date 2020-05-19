import express from 'express';

import { Op } from 'sequelize';
import { RestPlaceModel } from 'index';

import { BadRequest } from '@curveball/http-errors';
import { Category, RestPlace, WorkingPeriod } from '../models';

import {
    Categories, CompanySizes, RestCosts, RestDurations,
} from '../staticModels';

import {
    formatNumber, getWorkingPeriodForCurrentDay, isPointInsideCircle, isWorkingNow, translateText
} from '../util';

import config from '../config';

async function getPlacesByFilters(request: express.Request, response: express.Response) {
    const {
        categories, restCost, restDuration, companySize, restType, distance, userLatitude, userLongitude, workingOnly, confirmed
    } = request.query;

    const where: any = {
        confirmed: true,
    };

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

    if (['true', 'false'].includes(restType)) {
        where.isActiveRest = restType === 'true';
    }

    if (['true', 'false'].includes(confirmed)) {
        where.confirmed = confirmed === 'true';
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

    if (workingOnly === 'true') {
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
                dayOff: false
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
                model.workingPeriod.dayOff = true;
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
}

async function deletePlaces(request: express.Request, response: express.Response) {
    const { ids } = request.body;

    if (!(ids && Array.isArray(ids) && ids.length > 0)) {
        throw new BadRequest(translateText('errors.wrongPlaceId', request.locale));
    }

    const removedPlacesCount = await RestPlace.destroy({
        where: {
            id: { [Op.in]: ids }
        },
    });

    response.json({
        removed: removedPlacesCount > 0,
    });
}

function validatePlaceParams(request: express.Request, response: express.Response, next: express.NextFunction) {
    const {
        name, latitude, longitude, restDuration, restCost, companySize, isActiveRest, categoryIds, periods,
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

    if (typeof isActiveRest !== 'boolean') {
        throw new BadRequest(translateText('errors.wrongPlaceRestType', request.locale));
    }

    if (!(categoryIds && categoryIds.length)) {
        throw new BadRequest(translateText('errors.wrongPlaceCategories', request.locale));
    }

    const areCategoriesValid = categoryIds.every((categoryId: any) => Categories.isValid(Number(categoryId)));

    if (!areCategoriesValid) {
        throw new BadRequest(translateText('errors.wrongPlaceCategories', request.locale));
    }

    if (!(periods && Array.isArray(periods))) {
        throw new BadRequest(translateText('errors.wrongWorkingPeriods', request.locale));
    }

    Array.from({ length: 7 }).forEach((_, index) => {
        const periodForDay: any = periods.find((period) => period.dayStart === index);

        if (!periodForDay) {
            throw new BadRequest(translateText('errors.periodForDayNotSpecified', request.locale));
        }

        if (periodForDay.worksAllDay || periodForDay.dayOff) {
            return;
        }

        const {
            dayStart, dayEnd, timeStart, timeEnd
        } = periodForDay;

        const nextDayNumber = index === 6 ? 0 : index + 1;

        if (!(dayEnd === index || dayEnd === nextDayNumber)) {
            throw new BadRequest(translateText('errors.wrongWorkingPeriods', request.locale));
        }

        const timesAreValid = [timeStart, timeEnd].every((time) => typeof time === 'number' && time >= 0 && time <= 2359);

        if (!timesAreValid) {
            throw new BadRequest(translateText('errors.wrongWorkingPeriods', request.locale));
        }

        if (dayStart === dayEnd && timeEnd < timeStart) {
            throw new BadRequest(translateText('errors.wrongWorkingPeriods', request.locale));
        }
    });

    next();
}

async function addPlace(request: express.Request, response: express.Response) {
    const {
        name, latitude, longitude, restDuration, restCost, companySize, isActiveRest, categoryIds, periods,
    } = request.body;

    const placeModel = {
        name,
        latitude,
        longitude,
        restDuration,
        restCost,
        companySize,
        isActiveRest,
        confirmed: false,
    };

    const categories = await Category.findAll({
        where: {
            id: { [Op.in]: categoryIds },
        },
    });

    const place = await RestPlace.create(placeModel);
    await place.$set('categories', categories);

    const workingPeriods = periods.map((period: any) => {
        const params: any = {
            placeId: place.id,
            dayOfWeekStart: period.dayStart,
        };

        if (period.dayOff) {
            params.startTime = 0;
            params.endTime = 0;
            params.dayOfWeekEnd = period.dayStart;
        } else if (period.worksAllDay) {
            params.startTime = 0;
            params.endTime = 2359;
            params.dayOfWeekEnd = period.dayStart;
        } else {
            params.startTime = period.timeStart;
            params.endTime = period.timeEnd;
            params.dayOfWeekEnd = period.dayEnd ?? period.dayStart;
        }

        return WorkingPeriod.build(params);
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const periodModel of workingPeriods) {
        // eslint-disable-next-line no-await-in-loop
        await periodModel.save();
    }

    response.json({ created: true });
}

async function updatePlace(request: express.Request, response: express.Response) {
    const {
        name, latitude, longitude, restDuration, restCost, companySize, isActiveRest, categoryIds, id, periods
    } = request.body;

    if (!id) {
        throw new BadRequest(translateText('errors.wrongPlaceId', request.locale));
    }

    const place = await RestPlace.findOne({ where: { id }, include: [WorkingPeriod] });

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
        isActiveRest,
    };

    const categories = await Category.findAll({
        where: {
            id: { [Op.in]: categoryIds },
        },
    });

    await place.update(placeModel);
    await place.$set('categories', categories);

    // eslint-disable-next-line no-restricted-syntax
    for (const periodModel of place.workingPeriods) {
        const period = periods.find((item: any) => periodModel.dayOfWeekStart === item.dayStart);

        const params: any = {};

        if (period.dayOff) {
            params.startTime = 0;
            params.endTime = 0;
            params.dayOfWeekEnd = period.dayStart;
        } else if (period.worksAllDay) {
            params.startTime = 0;
            params.endTime = 2359;
            params.dayOfWeekEnd = period.dayStart;
        } else {
            params.startTime = period.timeStart;
            params.endTime = period.timeEnd;
            params.dayOfWeekEnd = period.dayEnd ?? period.dayStart;
        }

        // eslint-disable-next-line no-await-in-loop
        await periodModel.update(params);
    }

    response.json({ updated: true });
}

async function confirmPlace(request: express.Request, response: express.Response) {
    const { id } = request.body;

    if (!id) {
        throw new BadRequest(translateText('errors.wrongPlaceId', request.locale));
    }

    const place = await RestPlace.findOne({ where: { id } });

    if (!place) {
        throw new BadRequest(translateText('errors.placeNotFound', request.locale));
    }

    await place.update({ confirmed: true });

    response.json({ updated: true });
}

export default {
    getPlacesByFilters,
    validatePlaceParams,
    addPlace,
    updatePlace,
    deletePlaces,
    confirmPlace,
};
