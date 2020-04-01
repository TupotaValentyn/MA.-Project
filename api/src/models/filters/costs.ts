import { RestPlaceCost } from 'index';
import { translateText } from '../../util';

export function getAllCosts(locale: string = 'ru'): RestPlaceCost[] {
    return [
        'free',
        'inexpensive',
        'moderate',
        'expensive',
        'veryExpensive',
    ].map((priceLevel, index) => ({
        id: index + 1,
        name: translateText(`costs.${priceLevel}`, locale),
    }));
}

export function getById(id: number): RestPlaceCost {
    return getAllCosts().find((cost) => cost.id === id);
}
