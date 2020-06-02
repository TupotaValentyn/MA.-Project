import express from 'express';

import {
    Categories, CompanySizes, RestCosts, RestDurations
} from '../staticModels';

import { translateText } from '../util';

function getFilterModels(locale: string) {
    const categories = Categories.getAll()
        .map((category) => ({ id: category.id, name: translateText(category.nameTextId, locale) }));

    const costs = RestCosts.getAll()
        .map((cost) => ({ id: cost.id, name: translateText(cost.nameTextId, locale) }));

    const restDurations = RestDurations.getAll()
        .map((duration) => ({ id: duration.id, name: translateText(duration.nameTextId, locale) }));

    const companySizes = CompanySizes.getAll()
        .map((companySize) => ({ id: companySize.id, name: translateText(companySize.nameTextId, locale) }));

    return {
        categories,
        costs,
        restDurations,
        companySizes,
    };
}

async function getFilters(request: express.Request, response: express.Response) {
    const {
        categories, costs, companySizes, restDurations
    } = getFilterModels(request.locale);

    response.json({
        categories: [{ id: 0, name: translateText('anyVariant2', request.locale) }, ...categories],
        costs: [{ id: 0, name: translateText('anyVariant2', request.locale) }, ...costs],
        restDurations: [{ id: 0, name: translateText('anyVariant2', request.locale) }, ...restDurations],
        companySizes: [{ id: 0, name: translateText('anyVariant1', request.locale) }, ...companySizes],
    });
}

async function getFilters2(request: express.Request, response: express.Response) {
    const filterModels = getFilterModels(request.locale);
    response.json(filterModels);
}

export default {
    getFilters,
    getFilters2,
};
