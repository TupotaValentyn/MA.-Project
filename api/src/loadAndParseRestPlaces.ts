/* eslint no-await-in-loop: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-continue: 0 */
/* eslint no-use-before-define: 0 */

import { Client } from '@googlemaps/google-maps-services-js';
import { promisify } from 'util';
import { AddressType, Language, Place } from '@googlemaps/google-maps-services-js/dist/common';
import { getLogger } from 'log4js';
import { translateText } from './util';

import config from './config';
import createSequelizeInstance from './sequelize';

import { Category, RestPlace, WorkingPeriod } from './models';

const logger = getLogger('LoadPlaces');
logger.level = 'debug';

const promisifiedSetTimeout = promisify(setTimeout);

const client = new Client();

async function processSearchQuery(searchQuery: string, pageToken?: string): Promise<Place[]> {
    const places = <Place[]>[];

    const response = await client.textSearch({
        params: {
            query: searchQuery,
            key: config.GOOGLE_PLACES_API_KEY,
            pagetoken: pageToken,
            language: 'ru' as Language,
            location: { lat: 49.444431, lng: 32.059769 },
            radius: 25 * 1000, // 25km
        }
    });

    const { status, results, next_page_token: nextPageToken } = response.data;

    if (status === 'OK') {
        places.push(...results);

        // Load places from the next page
        if (nextPageToken) {
            // Without this delay, an error will be thrown
            await promisifiedSetTimeout(2000);

            const placesFromNextPages = await processSearchQuery(searchQuery, nextPageToken);
            places.push(...placesFromNextPages);
        }
    }

    return places;
}

async function processCategory(category: Category) {
    const categoryRuName = translateText(category.nameTextId);
    const categoryUaName = translateText(category.nameTextId, 'ua');

    logger.debug(`Ищем места в категории "${categoryRuName}"\n`);

    const searchQueries = [`${categoryRuName} Черкассы`, `${categoryUaName} Черкаси`];
    const placesData: Place[] = [];

    // Load all places from this category
    for (const searchQuery of searchQueries) {
        logger.debug(`Ищем места по запросу "${searchQuery}"`);

        const responses = await processSearchQuery(searchQuery);
        placesData.push(...responses);

        logger.debug(`По запросу "${searchQuery}" найдено ${responses.length} мест\n`);
    }

    logger.debug(`В категории "${categoryRuName}" всего найдено ${placesData.length} мест`);

    // Get unique places only
    const uniquePlaces = placesData.reduce((places, place) => {
        const placesWithSameId = places.filter((currentPlace) => currentPlace.place_id === place.place_id);

        if (!placesWithSameId.length) {
            places.push(place);
        }

        return places;
    }, []);

    logger.debug(`В категории "${categoryRuName}" отфильтровано ${uniquePlaces.length} уникальных мест\n`);

    const fields = getFieldNames();

    // Get details for each place and map them to our DB model
    for (const uniquePlace of uniquePlaces) {
        logger.debug(`Получаем детали места "${uniquePlace.name}"`);

        const response = await client.placeDetails({
            params: {
                key: process.env.GOOGLE_PLACES_API_KEY,
                place_id: uniquePlace.place_id,
                fields,
                language: 'ru' as Language,
            },
        });

        const placeDetails = response.data.result;

        // TODO: exclude places outside Cherkasy area

        // Skip this place if it's not from this category
        if (!placeDetails.types.includes(category.googleId as AddressType)) {
            logger.debug(`Место "${uniquePlace.name}" не из категории "${categoryRuName}", пропускаем`);
            logger.debug('--------------------------------');
            continue;
        }

        const placeModel = {
            googleId: placeDetails.place_id,
            name: placeDetails.name,
            latitude: placeDetails.geometry.location.lat,
            longitude: placeDetails.geometry.location.lng,
            googleMeanRating: placeDetails.rating,
            googleReviewsCount: (placeDetails as any).user_ratings_total,
            restDurationId: category.defaultRestDurationId,
            restCostId: placeDetails.price_level ? placeDetails.price_level + 1 : category.defaultRestDurationId,
            companySizeId: category.defaultCompanySizeId,
            isActiveRest: category.isActiveRest,
        };

        // Check if this place already exists in DB
        const dbPlaceModel = await RestPlace.findOne({
            where: { googleId: placeDetails.place_id },
            include: [Category, WorkingPeriod],
        });

        // No place in DB yet
        if (!dbPlaceModel) {
            logger.debug(`Места "${uniquePlace.name}" нет в БД, создаем`);

            const place = await RestPlace.create(placeModel);
            await place.$add('categories', [category]);

            if (placeDetails.opening_hours?.periods) {
                const workingPeriods = await generateWorkingPeriods(place.id, placeDetails);

                for (const workingPeriod of workingPeriods) {
                    await WorkingPeriod.create(workingPeriod);
                }
            }

            logger.debug(`Место "${uniquePlace.name}" успешно добавлено в БД`);
            logger.debug('--------------------------------');

            continue;
        }

        logger.debug(`Место "${uniquePlace.name}" есть в БД, обновляем информацию о нем`);

        // Update categories
        const savedCategory = dbPlaceModel.categories.find((item) => item.id === category.id);

        if (!savedCategory) {
            await dbPlaceModel.$add('categories', [category]);
            logger.debug(`Месту "${uniquePlace.name}" добавлена новая категория "${categoryRuName}"`);
        }

        // Update working periods
        if (placeDetails.opening_hours?.periods) {
            const workingPeriods = await generateWorkingPeriods(dbPlaceModel.id, placeDetails);

            for (const workingPeriod of dbPlaceModel.workingPeriods) {
                const period = workingPeriods.find((item) => workingPeriod.dayOfWeekStart === item.dayOfWeekStart);

                workingPeriod.dayOfWeekStart = period.dayOfWeekStart;
                workingPeriod.dayOfWeekEnd = period.dayOfWeekEnd;
                workingPeriod.startTime = period.startTime;
                workingPeriod.endTime = period.endTime;

                await workingPeriod.save();
            }
        }

        logger.debug(`Место "${uniquePlace.name}" успешно обновлено`);
        logger.debug('--------------------------------');
    }

    logger.debug('*****************************************');
}

async function generateWorkingPeriods(placeDBId: number, placeDetails: Place) {
    return Array(7).fill(0).map((_, index) => {
        const model = {
            placeId: placeDBId,
            dayOfWeekStart: index,
            startTime: dateAtMidnight(),
            dayOfWeekEnd: index,
            endTime: dateAtMidnight(),
        };

        // Place works 24/7 (set period 00:00:00 - 23:59:59)
        if (placeDetails.opening_hours.periods.length === 1) {
            model.endTime.setUTCHours(23);
            model.endTime.setUTCMinutes(59);
            model.endTime.setUTCSeconds(59);

            return model;
        }

        const dayInfo = placeDetails.opening_hours.periods.find((period) => period.open.day === index);

        // Place doesn't work this day (set period 00:00:00 - 00:00:00)
        if (!dayInfo) {
            return model;
        }

        // Set working periods
        if (dayInfo.open?.time) {
            const hours = dayInfo.open.time.substring(0, 2);
            const minutes = dayInfo.open.time.substring(2);

            model.startTime.setUTCHours(Number(hours));
            model.startTime.setUTCMinutes(Number(minutes));
        }

        if (dayInfo.close?.time) {
            const hours = dayInfo.close.time.substring(0, 2);
            const minutes = dayInfo.close.time.substring(2);

            model.endTime.setUTCHours(Number(hours));
            model.endTime.setUTCMinutes(Number(minutes));
        }


        if (dayInfo.close.day !== undefined) {
            model.dayOfWeekEnd = Number(dayInfo.close.day);
        }

        return model;
    });
}

function dateAtMidnight() {
    const date = new Date();

    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return date;
}

function getFieldNames() {
    return [
        'user_ratings_total',
        'address_component',
        'opening_hours',
        'price_level',
        'rating',
        'formatted_address',
        'geometry',
        'name',
        'permanently_closed',
        'place_id',
        'type',
    ];
}

(async function run() {
    try {
        createSequelizeInstance();

        const categories = await Category.findAll();

        for (const categoryData of categories) {
            await processCategory(categoryData);
        }
    } catch (error) {
        console.error(error);
    }
}());
