import { CategoryStaticModel } from 'index';
import RestDurations from './RestDurations';
import RestCosts from './RestCosts';
import CompanySizes from './CompanySizes';

class Categories {
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
                defaultRestDuration: RestDurations.High,
                defaultCompanySize: CompanySizes.Large,
                defaultRestCost: RestCosts.Moderate,
                isActiveRest: true,
            },

            {
                googleId: 'aquarium',
                nameTextId: 'restPlaceCategory.aquarium',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Inexpensive,
                isActiveRest: false,
            },

            {
                googleId: 'art_gallery',
                nameTextId: 'restPlaceCategory.artGallery',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Inexpensive,
                isActiveRest: false,
            },

            {
                googleId: 'bar',
                nameTextId: 'restPlaceCategory.bar',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Expensive,
                isActiveRest: false,
            },

            {
                googleId: 'cafe',
                nameTextId: 'restPlaceCategory.cafe',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Moderate,
                isActiveRest: false,
            },

            {
                googleId: 'library',
                nameTextId: 'restPlaceCategory.library',
                defaultRestDuration: RestDurations.High,
                defaultCompanySize: CompanySizes.Solo,
                defaultRestCost: RestCosts.Free,
                isActiveRest: false,
            },

            {
                googleId: 'movie_theater',
                nameTextId: 'restPlaceCategory.movieTheater',
                defaultRestDuration: RestDurations.High,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Moderate,
                isActiveRest: false,
            },

            {
                googleId: 'museum',
                nameTextId: 'restPlaceCategory.museum',
                defaultRestDuration: RestDurations.High,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Inexpensive,
                isActiveRest: false,
            },

            {
                googleId: 'night_club',
                nameTextId: 'restPlaceCategory.nightClub',
                defaultRestDuration: RestDurations.High,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Expensive,
                isActiveRest: false,
            },

            {
                googleId: 'park',
                nameTextId: 'restPlaceCategory.park',
                defaultRestDuration: RestDurations.High,
                defaultCompanySize: CompanySizes.Large,
                defaultRestCost: RestCosts.Free,
                isActiveRest: true,
            },

            {
                googleId: 'restaurant',
                nameTextId: 'restPlaceCategory.restaurant',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Little,
                defaultRestCost: RestCosts.VeryExpensive,
                isActiveRest: false,
            },

            {
                googleId: 'spa',
                nameTextId: 'restPlaceCategory.spa',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Little,
                defaultRestCost: RestCosts.VeryExpensive,
                isActiveRest: false,
            },

            {
                googleId: 'stadium',
                nameTextId: 'restPlaceCategory.stadium',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Little,
                defaultRestCost: RestCosts.Free,
                isActiveRest: true,
            },

            {
                googleId: 'tourist_attraction',
                nameTextId: 'restPlaceCategory.touristAttraction',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Free,
                isActiveRest: true,
            },

            {
                googleId: 'zoo',
                nameTextId: 'restPlaceCategory.zoo',
                defaultRestDuration: RestDurations.Medium,
                defaultCompanySize: CompanySizes.Medium,
                defaultRestCost: RestCosts.Inexpensive,
                isActiveRest: true,
            },
        ].map((item, index) => ({ ...item, id: index + 1 }));

        return this.categories;
    }

    public static isValid(categoryId: number): boolean {
        return categoryId >= Categories.AmusementPark && categoryId <= Categories.Zoo;
    }

    public static findById(id: number): CategoryStaticModel {
        return this.getAll().find((item) => item.id === id);
    }
}

export default Categories;
