import { Client } from '@googlemaps/google-maps-services-js';
// import { CategoryDescription } from 'index';
import { promisify } from 'util';
// import { getAllCategories } from './models/mappings/Category';
import { AddressType, Place } from '@googlemaps/google-maps-services-js/dist/common';
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details';
import { Column, HasMany } from 'sequelize-typescript';
import { translateText } from './util';
import config from './config';

import createSequelizeInstance from './sequelize';

import {
    User, CompanySize, Duration, Cost, Category, RestPlace, Review, BusinessHours, RestPlaceCategory,
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

    // eslint-disable-next-line no-restricted-syntax
    for (const searchQuery of searchQueries) {
        // eslint-disable-next-line no-await-in-loop
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

    // eslint-disable-next-line max-len
    const fields = 'user_ratings_total, address_component, opening_hours, price_level, rating, formatted_address, geometry, name, permanently_closed, place_id, type'.split(', ');

    // eslint-disable-next-line no-restricted-syntax
    for (const uniquePlace of uniquePlaces) {
        // eslint-disable-next-line no-await-in-loop
        const response = await client.placeDetails({
            params: {
                key: process.env.GOOGLE_PLACES_API_KEY,
                place_id: uniquePlace.place_id,
                fields,
                language: 'ru',
            },
        });

        const placeDetails = response.data.result;

        if (category.id !== 15 && !placeDetails.types.includes(category.googleId as AddressType)) {
            // eslint-disable-next-line no-continue
            continue;
        }

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

        // eslint-disable-next-line no-await-in-loop
        const dbPlaceModel = await RestPlace.findOne({
            where: { googleId: placeDetails.place_id },
            include: [Category],
        });

        if (!dbPlaceModel) {
            // eslint-disable-next-line no-await-in-loop
            const place = await RestPlace.create(placeModel);

            // eslint-disable-next-line no-await-in-loop
            await place.$add('categories', [category]);

            // eslint-disable-next-line no-continue
            continue;
        }

        const savedCategory = dbPlaceModel.categories.find((item) => item.id === category.id);

        if (!savedCategory) {
            // eslint-disable-next-line no-await-in-loop
            await dbPlaceModel.$add('categories', [category]);
            console.log('Updated', dbPlaceModel.categories.length, dbPlaceModel.id);
        }
    }
}

(async function run() {
    createSequelizeInstance();

    const categories = await Category.findAll();

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const categoryData of categories) {
        // eslint-disable-next-line no-await-in-loop
        await processCategory(categoryData);
    }
}());
