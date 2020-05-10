import { CategoryStaticModel } from 'index';
import RestDuration from './RestDuration';
import RestCost from './RestCost';
import CompanySize from './CompanySize';

class Category {
    static AmusementPark = 1;

    static Aquarium = 2;

    static ArtGallery = 3;

    static Bar = 4;

    static Cafe = 5;

    static Library = 6;

    static MovieTheater = 7;

    static Museum = 8;

    static NightClub = 9;

    static Park = 10;

    static Restaurant = 11;

    static Spa = 12;

    static Stadium = 13;

    static TouristAttraction = 14;

    static Zoo = 15;

    private static categories: CategoryStaticModel[];

    public static getAll(): CategoryStaticModel[] {
        if (this.categories) {
            return this.categories;
        }

        this.categories = [
            {
                googleId: 'amusement_park',
                nameTextId: 'restPlaceCategory.amusementPark',
                defaultRestDuration: RestDuration.High,
                defaultCompanySize: CompanySize.Large,
                defaultRestCost: RestCost.Moderate,
                isActiveRest: true,
            },

            {
                googleId: 'aquarium',
                nameTextId: 'restPlaceCategory.aquarium',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Inexpensive,
                isActiveRest: false,
            },

            {
                googleId: 'art_gallery',
                nameTextId: 'restPlaceCategory.artGallery',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Inexpensive,
                isActiveRest: false,
            },

            {
                googleId: 'bar',
                nameTextId: 'restPlaceCategory.bar',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Expensive,
                isActiveRest: false,
            },

            {
                googleId: 'cafe',
                nameTextId: 'restPlaceCategory.cafe',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Moderate,
                isActiveRest: false,
            },

            {
                googleId: 'library',
                nameTextId: 'restPlaceCategory.library',
                defaultRestDuration: RestDuration.High,
                defaultCompanySize: CompanySize.Solo,
                defaultRestCost: RestCost.Free,
                isActiveRest: false,
            },

            {
                googleId: 'movie_theater',
                nameTextId: 'restPlaceCategory.movieTheater',
                defaultRestDuration: RestDuration.High,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Moderate,
                isActiveRest: false,
            },

            {
                googleId: 'museum',
                nameTextId: 'restPlaceCategory.museum',
                defaultRestDuration: RestDuration.High,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Inexpensive,
                isActiveRest: false,
            },

            {
                googleId: 'night_club',
                nameTextId: 'restPlaceCategory.nightClub',
                defaultRestDuration: RestDuration.High,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Expensive,
                isActiveRest: false,
            },

            {
                googleId: 'park',
                nameTextId: 'restPlaceCategory.park',
                defaultRestDuration: RestDuration.High,
                defaultCompanySize: CompanySize.Large,
                defaultRestCost: RestCost.Free,
                isActiveRest: true,
            },

            {
                googleId: 'restaurant',
                nameTextId: 'restPlaceCategory.restaurant',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Little,
                defaultRestCost: RestCost.VeryExpensive,
                isActiveRest: false,
            },

            {
                googleId: 'spa',
                nameTextId: 'restPlaceCategory.spa',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Little,
                defaultRestCost: RestCost.VeryExpensive,
                isActiveRest: false,
            },

            {
                googleId: 'stadium',
                nameTextId: 'restPlaceCategory.stadium',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Little,
                defaultRestCost: RestCost.Free,
                isActiveRest: true,
            },

            {
                googleId: 'tourist_attraction',
                nameTextId: 'restPlaceCategory.touristAttraction',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Free,
                isActiveRest: false,
            },

            {
                googleId: 'zoo',
                nameTextId: 'restPlaceCategory.zoo',
                defaultRestDuration: RestDuration.Medium,
                defaultCompanySize: CompanySize.Medium,
                defaultRestCost: RestCost.Inexpensive,
                isActiveRest: true,
            },
        ].map((item, index) => ({ ...item, id: index + 1 }));

        return this.categories;
    }
}

export default Category;
