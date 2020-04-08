import { Client } from '@googlemaps/google-maps-services-js';
import { CategoryDescription } from 'index';
import { RestPlaceCategory, getAllCategories } from './models/filters/restPlaceCategory';
import { translateText } from './util';

const client = new Client();

async function processCategory(category: CategoryDescription) {
    const categoryRuName = translateText(category.nameTextId);
    const categoryUaName = translateText(category.nameTextId, 'ua');

    const searchQueries = [`${categoryRuName} Черкассы`, `${categoryUaName} Черкаси`];

    console.log(searchQueries);
}

(async function run() {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const categoryData of getAllCategories().values()) {
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
