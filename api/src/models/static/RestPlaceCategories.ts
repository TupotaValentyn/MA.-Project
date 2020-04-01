import { RestPlaceCategory } from 'index';
import { translateText } from '../../util';

export function getAllCategories(locale: string = 'ru'): RestPlaceCategory[] {
    return [
        'amusement_park',
        'aquarium',
        'art_gallery',
        'bar',
        'cafe',
        'library',
        'movie_theater',
        'museum',
        'night_club',
        'park',
        'restaurant',
        'spa',
        'stadium',
        'tourist_attraction',
        'zoo',
    ].map((googleCategoryId, index) => {
        const textId = googleCategoryId.replace(/_([a-z])/g, (replacement) => replacement.charAt(1).toUpperCase());

        return {
            id: index + 1,
            googleId: googleCategoryId,
            name: translateText(`categories.${textId}`, locale),
        };
    });
}

export function getById(id: number): RestPlaceCategory {
    return getAllCategories().find((category) => category.id === id);
}

export function getByGoogleId(googleId: string): RestPlaceCategory {
    return getAllCategories().find((category) => category.googleId === googleId);
}
