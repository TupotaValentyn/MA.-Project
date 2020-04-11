import { Client } from '@googlemaps/google-maps-services-js';
// import { CategoryDescription } from 'index';
import { promisify } from 'util';
// import { getAllCategories } from './models/mappings/RestPlaceCategory';
import { Place } from '@googlemaps/google-maps-services-js/dist/common';
import { PlaceDetailsResponseData } from '@googlemaps/google-maps-services-js/dist/places/details';
import { translateText } from './util';
import config from './config';

import createSequelizeInstance from './sequelize';

import {
    User, CompanySize, RestDuration, RestCost, RestPlaceCategory
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

    // console.log(response.data);

    const { status, results, next_page_token: nextPageToken } = response.data;

    if (status === 'OK') {
        // results.forEach((place) => console.log(place.name, place.types));
        // console.log();

        places.push(...results);

        if (nextPageToken) {
            await promisifiedSetTimeout(2000);

            const placesFromNextPages = await processSearchQuery(searchQuery, nextPageToken);
            places.push(...placesFromNextPages);
        }
    }

    return places;
}

async function processCategory(category: RestPlaceCategory) {
    const categoryRuName = translateText(category.nameTextId);
    const categoryUaName = translateText(category.nameTextId, 'ua');

    const searchQueries = [`${categoryRuName} Черкассы`, `${categoryUaName} Черкаси`];
    const placesData: Place[] = [];

    // console.log(searchQueries);

    // eslint-disable-next-line no-restricted-syntax
    for (const searchQuery of searchQueries) {
        // eslint-disable-next-line no-await-in-loop
        const responses = await processSearchQuery(searchQuery);
        placesData.push(...responses);
    }

    // console.log(1, placesData.length);

    const uniquePlaces = placesData.reduce((places, place) => {
        const sameIdPlaces = places.filter((currentPlace) => currentPlace.place_id === place.place_id);

        if (!sameIdPlaces.length) {
            places.push(place);
        }

        return places;
    }, []);

    const fields = 'address_component, opening_hours, price_level, rating, formatted_address, geometry, name, permanently_closed, place_id, type'.split(', ');

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

        console.log(placeDetails);

        // uniquePlacesDetails.push(response.data.result);
    }

    // console.log(2, uniquePlaces.length);

    // console.log(uniquePlacesDetails[0])
    // console.log(uniquePlacesDetails[1])
    // console.log(uniquePlacesDetails[2])
    // console.log(uniquePlacesDetails[3])

    // return placesData;
}

(async function run() {
    createSequelizeInstance();

    const categories = await RestPlaceCategory.findAll({
        // include: [
        //     { model: RestCost, as: 'defaultRestCost' },
        //     { model: RestDuration, as: 'defaultRestDuration' },
        //     { model: CompanySize, as: 'defaultCompanySize' },
        // ]
    });

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const categoryData of categories) {
        // eslint-disable-next-line no-await-in-loop
        await processCategory(categoryData);
    }
}());

// async function loadPlaces(pageToken: string) {
//     const response = await client.textSearch({
//         params: {
//             query: 'Кафе Черкассы',
//             key: config.GOOGLE_PLACES_API_KEY,
//             pagetoken: pageToken,
//         }
//     });
//
//     return response.data;
// }
//
// async function run(pageToken?: string) {
//     const { status, results, next_page_token: nextPageToken } = await loadPlaces(pageToken);
//
//     console.log(status, config.GOOGLE_PLACES_API_KEY)
//
//     if (status === 'OK' && nextPageToken) {
//         results.forEach((place) => console.log(place.name));
//         console.log();
//
//         setTimeout(() => {
//             run(nextPageToken);
//         }, 2000);
//     }
//
// eslint-disable-next-line max-len
//     // const fields = 'opening_hours, price_level, rating, address_component, adr_address, formatted_address, geometry, icon, name, permanently_closed, photo, place_id, plus_code, type, url, utc_offset, vicinity'.split(', ')
//
//     // console.log(fields)
//     //
//     client.placeDetails({
//         params: {
//             key: process.env.GOOGLE_PLACES_API_KEY,
//             place_id: 'ChIJbVJHdH1L0UARWULadvIq1bI',
//             // eslint-disable-next-line max-len
//             fields
//         },
//     }).then((res) => {
//     //     console.log(res.data);
//     // }).catch((er) => {
//     //     console.log(er);
//     // });
//     // }).catch((error) => {
//     //     console.log(error);
//     // });
// }
//
// run();
