import {
    User, CompanySize, Duration, Cost, Category
} from '../models';

import {
    CompanySizeMapping, RestDurationMapping, RestCostMapping
} from '../models/mappings';

import createSequelizeInstance from '../sequelize';

(async () => {
    const sequelizeInstance = createSequelizeInstance();
    await sequelizeInstance.sync({ alter: true });

    console.log('CompanySize - Start');
    const companySizes = ['solo', 'little', 'medium', 'large'];

    // eslint-disable-next-line no-restricted-syntax
    for (const nameTextId of companySizes) {
        // eslint-disable-next-line no-await-in-loop
        await CompanySize.create({ nameTextId: `companySize.${nameTextId}` });
    }

    console.log('CompanySize - Finish\n');


    console.log('Cost - Start');
    const restCosts = ['free', 'inexpensive', 'moderate', 'expensive', 'veryExpensive'];

    // eslint-disable-next-line no-restricted-syntax
    for (const nameTextId of restCosts) {
        // eslint-disable-next-line no-await-in-loop
        await Cost.create({ nameTextId: `restCost.${nameTextId}` });
    }

    console.log('Cost - Finish\n');


    console.log('Duration - Start');
    const restDurations = ['low', 'medium', 'high'];

    // eslint-disable-next-line no-restricted-syntax
    for (const nameTextId of restDurations) {
        // eslint-disable-next-line no-await-in-loop
        await Duration.create({ nameTextId: `restDuration.${nameTextId}` });
    }

    console.log('Duration - Finish\n');


    console.log('Category - Start');

    // eslint-disable-next-line no-restricted-syntax,no-use-before-define
    for (const categoryData of getCategories()) {
        // eslint-disable-next-line no-await-in-loop
        await Category.create(categoryData);
    }

    console.log('Category - Finish\n');

    console.log('User - Start');

    await User.create({
        email: 'admin@test.com',
        password: '$2b$04$6cqzfP5tUxf3L0.OEOyYM.ppXshp/cGxDST/NZZh5FPAZYgcJ88om',
        isAdmin: true,
        isConfirmed: true,
    });

    await User.create({
        email: 'user@test.com',
        password: '$2b$04$6cqzfP5tUxf3L0.OEOyYM.ppXshp/cGxDST/NZZh5FPAZYgcJ88om',
        isAdmin: false,
        isConfirmed: true,
    });

    console.log('User - Finish\n');
})();

function getCategories() {
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
