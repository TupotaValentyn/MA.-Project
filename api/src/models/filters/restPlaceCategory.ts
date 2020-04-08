import { CategoryDescription } from 'index';
import { RestDuration } from './restDuration';
import { CompanySize } from './companySize';

export enum RestPlaceCategory {
    AmusementPark,
    Aquarium,
    ArtGallery,
    Bar,
    Cafe,
    Library,
    MovieTheater,
    Museum,
    NightClub,
    Park,
    Restaurant,
    Spa,
    Stadium,
    TouristAttraction,
    Zoo,
}

export const getAllCategories = (): Map<RestPlaceCategory, CategoryDescription> => new Map<number, CategoryDescription>([
    [RestPlaceCategory.AmusementPark, {
        googleId: 'amusement_park',
        nameTextId: 'restPlaceCategory.amusementPark',
        restDuration: RestDuration.High,
        companySize: CompanySize.Large,
        isActiveRest: true,
    }],

    [RestPlaceCategory.Aquarium, {
        googleId: 'aquarium',
        nameTextId: 'restPlaceCategory.aquarium',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.ArtGallery, {
        googleId: 'art_gallery',
        nameTextId: 'restPlaceCategory.artGallery',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Bar, {
        googleId: 'bar',
        nameTextId: 'restPlaceCategory.bar',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Cafe, {
        googleId: 'cafe',
        nameTextId: 'restPlaceCategory.cafe',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Library, {
        googleId: 'library',
        nameTextId: 'restPlaceCategory.library',
        restDuration: RestDuration.High,
        companySize: CompanySize.Solo,
        isActiveRest: false,
    }],

    [RestPlaceCategory.MovieTheater, {
        googleId: 'movie_theater',
        nameTextId: 'restPlaceCategory.movieTheater',
        restDuration: RestDuration.High,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Museum, {
        googleId: 'museum',
        nameTextId: 'restPlaceCategory.museum',
        restDuration: RestDuration.High,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.NightClub, {
        googleId: 'night_club',
        nameTextId: 'restPlaceCategory.nightClub',
        restDuration: RestDuration.High,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Park, {
        googleId: 'park',
        nameTextId: 'restPlaceCategory.park',
        restDuration: RestDuration.High,
        companySize: CompanySize.Large,
        isActiveRest: true,
    }],

    [RestPlaceCategory.Restaurant, {
        googleId: 'restaurant',
        nameTextId: 'restPlaceCategory.restaurant',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Little,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Spa, {
        googleId: 'spa',
        nameTextId: 'restPlaceCategory.spa',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Little,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Stadium, {
        googleId: 'stadium',
        nameTextId: 'restPlaceCategory.stadium',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Little,
        isActiveRest: true,
    }],

    [RestPlaceCategory.TouristAttraction, {
        googleId: 'tourist_attraction',
        nameTextId: 'restPlaceCategory.touristAttraction',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Medium,
        isActiveRest: false,
    }],

    [RestPlaceCategory.Zoo, {
        googleId: 'zoo',
        nameTextId: 'restPlaceCategory.zoo',
        restDuration: RestDuration.Medium,
        companySize: CompanySize.Medium,
        isActiveRest: true,
    }],
]);
