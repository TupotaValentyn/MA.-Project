/* eslint no-await-in-loop: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-continue: 0 */
/* eslint no-use-before-define: 0 */

import { Client } from '@googlemaps/google-maps-services-js';
import { promisify } from 'util';
import { AddressType, Place } from '@googlemaps/google-maps-services-js/dist/common';
import { translateText } from './util';

import config from './config';
import createSequelizeInstance from './sequelize';

import {
    User, CompanySize, Duration, Cost, Category, RestPlace, Review, WorkingPeriod, RestPlaceCategory,
} from './models';

const promisifiedSetTimeout = promisify(setTimeout);

const client = new Client();

async function processSearchQuery(searchQuery: string, pageToken?: string): Promise<Place[]> {
    const places = <Place[]>[];

    const response = await client.textSearch({
        params: {
            query: searchQuery,
            key: config.GOOGLE_PLACES_API_KEY,
            pagetoken: pageToken,
            language: 'ru',
        }
    });

    const { status, results, next_page_token: nextPageToken } = response.data;

    if (status === 'OK') {
        places.push(...results);

        if (nextPageToken) {
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

    const searchQueries = [`${categoryRuName} Черкассы`, `${categoryUaName} Черкаси`];
    const placesData: Place[] = [];

    for (const searchQuery of searchQueries) {
        const responses = await processSearchQuery(searchQuery);
        placesData.push(...responses);
    }

    const uniquePlaces = placesData.reduce((places, place) => {
        const sameIdPlaces = places.filter((currentPlace) => currentPlace.place_id === place.place_id);

        if (!sameIdPlaces.length) {
            places.push(place);
        }

        return places;
    }, []);

    const fields = getFieldNames();

    for (const uniquePlace of uniquePlaces) {
        const response = await client.placeDetails({
            params: {
                key: process.env.GOOGLE_PLACES_API_KEY,
                place_id: uniquePlace.place_id,
                fields,
                language: 'ru',
            },
        });

        const placeDetails = response.data.result;

        if (/* category.id !== 15 && */!placeDetails.types.includes(category.googleId as AddressType)) {
            continue;
        }

        console.log();
        // console.log(placeDetails.opening_hours?.periods);
        console.log(placeDetails.opening_hours && placeDetails.opening_hours.weekday_text);

        // break;

        const placeModel = {
            googleId: placeDetails.place_id,
            name: placeDetails.name,
            latitude: placeDetails.geometry.location.lat,
            longitude: placeDetails.geometry.location.lng,
            googleMeanRating: placeDetails.rating,
            googleReviewsCount: (placeDetails as any).user_ratings_total,
            restDuration: category.defaultRestDurationId,
            restCost: placeDetails.price_level ? placeDetails.price_level + 1 : category.defaultRestDurationId,
            companySize: category.defaultCompanySizeId,
            isActiveRest: category.isActiveRest,
            categories: [category],
        };

        const dbPlaceModel = await RestPlace.findOne({
            where: { googleId: placeDetails.place_id },
            include: [Category],
        });

        if (!dbPlaceModel) {
            const place = await RestPlace.create(placeModel);
            await place.$add('categories', [category]);

            const businessHours = Array(7).fill(0).map((_, index) => {
                const startDate = dateAtMidnight();
                const endDate = dateAtMidnight();

                const model = {
                    placeId: place.id,
                    dayOfWeekStart: index,
                    startTime: startDate,
                    dayOfWeekEnd: index,
                    endTime: endDate,
                };

                if (!placeDetails.opening_hours) {
                    return model;
                }

                // Заведение работает 24/7, ставим период работы 00:00:00 - 23:59:59
                if (placeDetails.opening_hours.periods.length === 1) {
                    model.endTime.setHours(23);
                    model.endTime.setMinutes(59);
                    model.endTime.setSeconds(59);

                    return model;
                }

                // В API 0 - это воскресенье, нужно сделать первым днем понедельник
                const apiDayIndex = index === 6 ? 0 : index + 1;
                const dayInfo = placeDetails.opening_hours.periods
                    .find((period) => period.open && period.open.day === apiDayIndex);

                // Данных об этом дне нет - выходной в заведении
                if (!dayInfo) {
                    return model;
                }

                if (dayInfo.open) {
                    if (dayInfo.open.time) {
                        const hours = dayInfo.open.time.substring(0, 2);
                        const minutes = dayInfo.open.time.substring(2);

                        model.startTime.setHours(Number(hours));
                        model.startTime.setMinutes(Number(minutes));
                    }

                    if (dayInfo.open.day) {
                        model.dayOfWeekStart = dayInfo.open.day;
                    }
                }

                if (dayInfo.close) {
                    if (dayInfo.close.time) {
                        const hours = dayInfo.close.time.substring(0, 2);
                        const minutes = dayInfo.close.time.substring(2);

                        model.endTime.setHours(Number(hours));
                        model.endTime.setMinutes(Number(minutes));
                    }

                    if (dayInfo.close.day) {
                        model.dayOfWeekEnd = dayInfo.close.day;
                    }
                } else {
                    model.dayOfWeekEnd = dayInfo.open.day;
                }

                return model;
            });

            console.log(businessHours);

            await WorkingPeriod.create(businessHours[0]);

            continue;
        }

        const savedCategory = dbPlaceModel.categories.find((item) => item.id === category.id);

        if (!savedCategory) {
            await dbPlaceModel.$add('categories', [category]);
            console.log('Updated', dbPlaceModel.categories.length, dbPlaceModel.id);
        }
    }
}

function dateAtMidnight() {
    const date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

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
    createSequelizeInstance();

    const categories = await Category.findAll();

    for (const categoryData of categories) {
        await processCategory(categoryData);
    }
}());
