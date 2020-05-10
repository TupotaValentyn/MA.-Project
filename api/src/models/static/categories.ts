import { CompanySizeMapping, RestCostMapping, RestDurationMapping } from './index';

enum RestPlaceCategoryMapping {
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

function getAllCategories() {
    return [
        {
            googleId: 'amusement_park',
            nameTextId: 'restPlaceCategory.amusementPark',
            defaultRestDurationId: RestDurationMapping.High,
            defaultCompanySizeId: CompanySizeMapping.Large,
            defaultRestCostId: RestCostMapping.Moderate,
            isActiveRest: true,
        },

        {
            googleId: 'aquarium',
            nameTextId: 'restPlaceCategory.aquarium',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Inexpensive,
            isActiveRest: false,
        },

        {
            googleId: 'art_gallery',
            nameTextId: 'restPlaceCategory.artGallery',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Inexpensive,
            isActiveRest: false,
        },

        {
            googleId: 'bar',
            nameTextId: 'restPlaceCategory.bar',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Expensive,
            isActiveRest: false,
        },

        {
            googleId: 'cafe',
            nameTextId: 'restPlaceCategory.cafe',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Moderate,
            isActiveRest: false,
        },

        {
            googleId: 'library',
            nameTextId: 'restPlaceCategory.library',
            defaultRestDurationId: RestDurationMapping.High,
            defaultCompanySizeId: CompanySizeMapping.Solo,
            defaultRestCostId: RestCostMapping.Free,
            isActiveRest: false,
        },

        {
            googleId: 'movie_theater',
            nameTextId: 'restPlaceCategory.movieTheater',
            defaultRestDurationId: RestDurationMapping.High,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Moderate,
            isActiveRest: false,
        },

        {
            googleId: 'museum',
            nameTextId: 'restPlaceCategory.museum',
            defaultRestDurationId: RestDurationMapping.High,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Inexpensive,
            isActiveRest: false,
        },

        {
            googleId: 'night_club',
            nameTextId: 'restPlaceCategory.nightClub',
            defaultRestDurationId: RestDurationMapping.High,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Expensive,
            isActiveRest: false,
        },

        {
            googleId: 'park',
            nameTextId: 'restPlaceCategory.park',
            defaultRestDurationId: RestDurationMapping.High,
            defaultCompanySizeId: CompanySizeMapping.Large,
            defaultRestCostId: RestCostMapping.Free,
            isActiveRest: true,
        },

        {
            googleId: 'restaurant',
            nameTextId: 'restPlaceCategory.restaurant',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Little,
            defaultRestCostId: RestCostMapping.VeryExpensive,
            isActiveRest: false,
        },

        {
            googleId: 'spa',
            nameTextId: 'restPlaceCategory.spa',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Little,
            defaultRestCostId: RestCostMapping.VeryExpensive,
            isActiveRest: false,
        },

        {
            googleId: 'stadium',
            nameTextId: 'restPlaceCategory.stadium',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Little,
            defaultRestCostId: RestCostMapping.Free,
            isActiveRest: true,
        },

        {
            googleId: 'tourist_attraction',
            nameTextId: 'restPlaceCategory.touristAttraction',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Free,
            isActiveRest: false,
        },

        {
            googleId: 'zoo',
            nameTextId: 'restPlaceCategory.zoo',
            defaultRestDurationId: RestDurationMapping.Medium,
            defaultCompanySizeId: CompanySizeMapping.Medium,
            defaultRestCostId: RestCostMapping.Inexpensive,
            isActiveRest: true,
        },
    ];
}
