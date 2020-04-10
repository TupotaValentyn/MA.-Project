import { CategoryDescription } from 'index';

export enum RestPlaceCategoryMapping {
    AmusementPark = 1,
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

// export const getAllCategories = (): Map<RestPlaceCategoryMapping, CategoryDescription> => new Map<number, CategoryDescription>([
//     [RestPlaceCategoryMapping.AmusementPark, {
//         googleId: 'amusement_park',
//         nameTextId: 'restPlaceCategory.amusementPark',
//         restDuration: RestDuration.High,
//         companySize: CompanySize.Large,
//         isActiveRest: true,
//     }],
//
//     [RestPlaceCategoryMapping.Aquarium, {
//         googleId: 'aquarium',
//         nameTextId: 'restPlaceCategory.aquarium',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.ArtGallery, {
//         googleId: 'art_gallery',
//         nameTextId: 'restPlaceCategory.artGallery',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Bar, {
//         googleId: 'bar',
//         nameTextId: 'restPlaceCategory.bar',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Cafe, {
//         googleId: 'cafe',
//         nameTextId: 'restPlaceCategory.cafe',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Library, {
//         googleId: 'library',
//         nameTextId: 'restPlaceCategory.library',
//         restDuration: RestDuration.High,
//         companySize: CompanySize.Solo,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.MovieTheater, {
//         googleId: 'movie_theater',
//         nameTextId: 'restPlaceCategory.movieTheater',
//         restDuration: RestDuration.High,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Museum, {
//         googleId: 'museum',
//         nameTextId: 'restPlaceCategory.museum',
//         restDuration: RestDuration.High,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.NightClub, {
//         googleId: 'night_club',
//         nameTextId: 'restPlaceCategory.nightClub',
//         restDuration: RestDuration.High,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Park, {
//         googleId: 'park',
//         nameTextId: 'restPlaceCategory.park',
//         restDuration: RestDuration.High,
//         companySize: CompanySize.Large,
//         isActiveRest: true,
//     }],
//
//     [RestPlaceCategoryMapping.Restaurant, {
//         googleId: 'restaurant',
//         nameTextId: 'restPlaceCategory.restaurant',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Little,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Spa, {
//         googleId: 'spa',
//         nameTextId: 'restPlaceCategory.spa',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Little,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Stadium, {
//         googleId: 'stadium',
//         nameTextId: 'restPlaceCategory.stadium',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Little,
//         isActiveRest: true,
//     }],
//
//     [RestPlaceCategoryMapping.TouristAttraction, {
//         googleId: 'tourist_attraction',
//         nameTextId: 'restPlaceCategory.touristAttraction',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Medium,
//         isActiveRest: false,
//     }],
//
//     [RestPlaceCategoryMapping.Zoo, {
//         googleId: 'zoo',
//         nameTextId: 'restPlaceCategory.zoo',
//         restDuration: RestDuration.Medium,
//         companySize: CompanySize.Medium,
//         isActiveRest: true,
//     }],
// ]);
