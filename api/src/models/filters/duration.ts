import { RestPlaceDuration } from 'index';
import { translateText } from '../../util';

export function getAllCosts(locale: string = 'ru'): RestPlaceDuration[] {
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

export function getById(id: number): RestPlaceDuration {
    return getAllCosts().find((cost) => cost.id === id);
}
