import { translateText } from '../../util';

export enum Categories {
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

interface CategoryDescription {
    name: string,
    googleId: string,
}

export const getAllCategories = (locale: string = 'ru'): Map<Categories, CategoryDescription> => new Map<number, CategoryDescription>([
    [Categories.AmusementPark, { googleId: 'amusement_park', name: translateText('categories.amusementPark', locale) }],
    [Categories.Aquarium, { googleId: 'aquarium', name: translateText('categories.aquarium', locale) }],
    [Categories.ArtGallery, { googleId: 'art_gallery', name: translateText('categories.artGallery', locale) }],
    [Categories.Bar, { googleId: 'bar', name: translateText('categories.bar', locale) }],
    [Categories.Cafe, { googleId: 'cafe', name: translateText('categories.cafe', locale) }],
    [Categories.Library, { googleId: 'library', name: translateText('categories.library', locale) }],
    [Categories.MovieTheater, { googleId: 'movie_theater', name: translateText('categories.movieTheater', locale) }],
    [Categories.Museum, { googleId: 'museum', name: translateText('categories.museum', locale) }],
    [Categories.NightClub, { googleId: 'night_club', name: translateText('categories.nightClub', locale) }],
    [Categories.Park, { googleId: 'park', name: translateText('categories.park', locale) }],
    [Categories.Restaurant, { googleId: 'restaurant', name: translateText('categories.restaurant', locale) }],
    [Categories.Spa, { googleId: 'spa', name: translateText('categories.spa', locale) }],
    [Categories.Stadium, { googleId: 'stadium', name: translateText('categories.stadium', locale) }],
    [Categories.TouristAttraction, { googleId: 'tourist_attraction', name: translateText('categories.touristAttraction', locale) }],
    [Categories.Zoo, { googleId: 'zoo', name: translateText('categories.zoo', locale) }],
]);
