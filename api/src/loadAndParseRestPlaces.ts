import { Client } from '@googlemaps/google-maps-services-js';
import { CategoryDescription } from 'index';
import { promisify } from 'util';
import { RestPlaceCategory, getAllCategories } from './models/filters/restPlaceCategory';
import { translateText } from './util';
import config from './config';

const promisifiedSetTimeout = promisify(setTimeout);

const client = new Client();

async function processSearchQuery(searchQuery: string, pageToken?: string): Promise<object[]> {
    const places = <object[]>[];

    const response = await client.textSearch({
        params: {
            query: searchQuery,
            key: config.GOOGLE_PLACES_API_KEY,
            pagetoken: pageToken,
        }
    });

    // console.log(response.data);

    const { status, results, next_page_token: nextPageToken } = response.data;

    if (status === 'OK') {
        results.forEach((place) => console.log(place.name, place.types));
        console.log();

        if (nextPageToken) {
            await promisifiedSetTimeout(2000);

            const placesFromNextPages = await processSearchQuery(searchQuery, nextPageToken);
            places.push(...placesFromNextPages);
        }
    }

    return places;
}

async function processCategory(category: CategoryDescription) {
    const categoryRuName = translateText(category.nameTextId);
    const categoryUaName = translateText(category.nameTextId, 'ua');

    const searchQueries = [`${categoryRuName} Черкассы`, `${categoryUaName} Черкаси`];
    const placesData: object[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const searchQuery of searchQueries) {
        // eslint-disable-next-line no-await-in-loop
        const responses = await processSearchQuery(searchQuery);
        placesData.push(...responses);
    }

    // console.log(placesData.length);
}

(async function run() {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const categoryData of getAllCategories().values()) {
        console.log();
        console.log(translateText(categoryData.nameTextId));
        console.log();

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
//     // client.placeDetails({
//     //     params: {
//     //         key: process.env.GOOGLE_PLACES_API_KEY,
//     //         place_id: 'ChIJbVJHdH1L0UARWULadvIq1bI',
//     //         // eslint-disable-next-line max-len
//     //         fields
//     //     },
//     // }).then((res) => {
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
