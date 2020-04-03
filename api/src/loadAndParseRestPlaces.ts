import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client();

async function loadPlaces(pageToken: string) {
    const response = await client.textSearch({
        params: {
            query: 'Кафе Черкассы',
            key: process.env.GOOGLE_PLACES_API_KEY,
            pagetoken: pageToken,
        }
    });

    return response.data;
}

async function run(pageToken?: string) {
    const { status, results, next_page_token: nextPageToken } = await loadPlaces(pageToken);

    if (status === 'OK' && nextPageToken) {
        results.forEach((place) => console.log(place.name));
        console.log();

        setTimeout(() => {
            run(nextPageToken);
        }, 2000);
    }

    // eslint-disable-next-line max-len
    // const fields = 'opening_hours, price_level, rating, address_component, adr_address, formatted_address, geometry, icon, name, permanently_closed, photo, place_id, plus_code, type, url, utc_offset, vicinity'.split(', ')

    // console.log(fields)
    //
    // client.placeDetails({
    //     params: {
    //         key: process.env.GOOGLE_PLACES_API_KEY,
    //         place_id: 'ChIJbVJHdH1L0UARWULadvIq1bI',
    //         // eslint-disable-next-line max-len
    //         fields
    //     },
    // }).then((res) => {
    //     console.log(res.data);
    // }).catch((er) => {
    //     console.log(er);
    // });
    // }).catch((error) => {
    //     console.log(error);
    // });
}

run();
