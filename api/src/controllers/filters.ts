import express from 'express';

import {
    Categories, CompanySizes, RestCosts, RestDurations
} from '../staticModels';
import { translateText } from '../util';

async function getFilters(request: express.Request, response: express.Response) {
    const categories = Categories.getAll()
        .map((category) => ({ id: category.id, name: translateText(category.nameTextId, request.locale) }));

    const costs = RestCosts.getAll()
        .map((cost) => ({ id: cost.id, name: translateText(cost.nameTextId, request.locale) }));

    const restDurations = RestDurations.getAll()
        .map((duration) => ({ id: duration.id, name: translateText(duration.nameTextId, request.locale) }));

    const companySizes = CompanySizes.getAll()
        .map((companySize) => ({ id: companySize.id, name: translateText(companySize.nameTextId, request.locale) }));

    response.json({
        categories,
        costs,
        restDurations,
        companySizes,
    });
}

export default {
    getFilters,
};