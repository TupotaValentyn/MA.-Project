/* eslint no-await-in-loop: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-continue: 0 */
/* eslint no-use-before-define: 0 */

import fs from 'fs';
import path from 'path';
import { Client } from '@googlemaps/google-maps-services-js';
import { promisify } from 'util';
import { AddressType, Language, Place } from '@googlemaps/google-maps-services-js/dist/common';
import { getLogger } from 'log4js';
import { translateText, isPointInsideCircle } from './util';

import config from './config';
import createSequelizeInstance from './sequelize';

import { Category, RestPlace, WorkingPeriod } from './models';

const logsDirectoryPath = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDirectoryPath)) {
    fs.mkdirSync(path.join(__dirname, '../logs'));
}

const stream = fs.createWriteStream(path.join(__dirname, '../logs/load.log'), { flags: 'w' });

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
        }
    });

    const { status, results, next_page_token: nextPageToken } = response.data;

    if (status === 'OK') {
        places.push(...results);

        // Load placesController from the next page
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
    const categoryRuName = translateText(category.nameTextId, 'ru');
    const categoryUaName = translateText(category.nameTextId, 'ua');

    log(`Ищем места в категории "${categoryRuName}"\n`);

    const searchQueries = [`${categoryRuName} Черкассы`, `${categoryUaName} Черкаси`];
    const placesData: Place[] = [];

    // Load all placesController from this category
    for (const searchQuery of searchQueries) {
        log(`Ищем места по запросу "${searchQuery}"`);

        const responses = await processSearchQuery(searchQuery);
        placesData.push(...responses);

        log(`По запросу "${searchQuery}" найдено ${responses.length} мест\n`);
    }

    log(`В категории "${categoryRuName}" всего найдено ${placesData.length} мест`);

    // Get unique placesController only
    const uniquePlaces = placesData.reduce((places, place) => {
        const placesWithSameId = places.filter((currentPlace) => currentPlace.place_id === place.place_id);

        if (!placesWithSameId.length) {
            places.push(place);
        }

        return places;
    }, []);

    log(`В категории "${categoryRuName}" отфильтровано ${uniquePlaces.length} уникальных мест\n`);

    const fields = getFieldNames();

    // Get details for each place and map them to our DB model
    for (const uniquePlace of uniquePlaces) {
        log(`Получаем детали места "${uniquePlace.name}"`);

        const response = await client.placeDetails({
            params: {
                key: process.env.GOOGLE_PLACES_API_KEY,
                place_id: uniquePlace.place_id,
                fields,
                language: 'ru' as Language,
            },
        });

        const placeDetails = response.data.result;

        const isPlaceInsideCherkasyBounds = isPointInsideCircle(
            config.CHERKASY_CENTER,
            config.CHERKASY_BOUNDS_RADIUS,
            { lat: placeDetails.geometry.location.lat, lng: placeDetails.geometry.location.lng }
        );

        if (!isPlaceInsideCherkasyBounds) {
            log(`Место "${uniquePlace.name} (${uniquePlace.formatted_address})" находится не в Черкассах, пропускаем`);
            log('--------------------------------');
            continue;
        }

        // Skip this place if it's not from this category
        if (!placeDetails.types.includes(category.googleId as AddressType)) {
            log(`Место "${uniquePlace.name}" не из категории "${categoryRuName}", пропускаем`);
            log('--------------------------------');
            continue;
        }

        const placeModel = {
            googleId: placeDetails.place_id,
            name: placeDetails.name,
            latitude: placeDetails.geometry.location.lat,
            longitude: placeDetails.geometry.location.lng,
            googleMeanRating: placeDetails.rating,
            googleReviewsCount: (placeDetails as any).user_ratings_total,
            restDuration: category.defaultRestDuration,
            restCost: placeDetails.price_level ? placeDetails.price_level + 1 : category.defaultRestDuration,
            companySize: category.defaultCompanySize,
            isActiveRest: category.isActiveRest,
        };

        // Check if this place already exists in DB
        const dbPlaceModel = await RestPlace.findOne({
            where: { googleId: placeDetails.place_id },
            include: [Category, WorkingPeriod],
        });

        // No place in DB yet
        if (!dbPlaceModel) {
            log(`Места "${uniquePlace.name}" нет в БД, создаем`);

            const place = await RestPlace.create(placeModel);
            await place.$add('categories', [category]);

            if (placeDetails.opening_hours?.periods) {
                const workingPeriods = await generateWorkingPeriods(place.id, placeDetails);

                for (const workingPeriod of workingPeriods) {
                    await WorkingPeriod.create(workingPeriod);
                }
            }

            log(`Место "${uniquePlace.name}" успешно добавлено в БД`);
            log('--------------------------------');

            continue;
        }

        log(`Место "${uniquePlace.name}" есть в БД, обновляем информацию о нем`);

        // Update categories
        const savedCategory = dbPlaceModel.categories.find((item) => item.id === category.id);

        if (!savedCategory) {
            await dbPlaceModel.$add('categories', [category]);
            log(`Месту "${uniquePlace.name}" добавлена новая категория "${categoryRuName}"`);
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

        log(`Место "${uniquePlace.name}" успешно обновлено`);
        log('--------------------------------');
    }

    log('*****************************************');
}

async function generateWorkingPeriods(placeDBId: number, placeDetails: Place) {
    return Array(7).fill(0).map((_, index) => {
        const model = {
            placeId: placeDBId,
            dayOfWeekStart: index,
            startTime: 0,
            dayOfWeekEnd: index,
            endTime: 0,
        };

        // Place works 24/7 (set period 00:00 - 23:59)
        if (placeDetails.opening_hours.periods.length === 1) {
            model.endTime = 2359;
            return model;
        }

        const dayInfo = placeDetails.opening_hours.periods.find((period) => period.open.day === index);

        // Place doesn't work this day (set period 00:00 - 00:00)
        if (!dayInfo) {
            return model;
        }

        // Set working periods
        if (dayInfo.open?.time) {
            const hours = dayInfo.open.time.substring(0, 2);
            const minutes = dayInfo.open.time.substring(2);

            // 18:00 -> 1800
            model.startTime = Number(hours) * 100 + Number(minutes);
        }

        if (dayInfo.close?.time) {
            const hours = dayInfo.close.time.substring(0, 2);
            const minutes = dayInfo.close.time.substring(2);

            // 18:00 -> 1800
            model.endTime = Number(hours) * 100 + Number(minutes);
        }


        if (dayInfo.close.day !== undefined) {
            model.dayOfWeekEnd = Number(dayInfo.close.day);
        }

        return model;
    });
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

function log(data: string) {
    logger.debug(data);
    stream.write(data);
    stream.write('\n');
}

(async function run() {
    try {
        createSequelizeInstance();

        const categories = await Category.findAll();

        for (const categoryData of categories) {
            await processCategory(categoryData);
        }

        stream.close();
    } catch (error) {
        console.error(error);
    }
}());
